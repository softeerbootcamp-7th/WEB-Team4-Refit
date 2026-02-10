package com.shyashyashya.refit.domain.qnaset.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.QNA_SET_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.STAR_ANALYSIS_CREATION_ALREADY_IN_PROGRESS;
import static com.shyashyashya.refit.global.exception.ErrorCode.STAR_ANALYSIS_PARSING_FAILED;
import static reactor.core.scheduler.Schedulers.boundedElastic;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shyashyashya.refit.domain.interview.dto.StarAnalysisDto;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.qnaset.repository.StarAnalysisRepository;
import com.shyashyashya.refit.domain.qnaset.service.temp.GeminiGenerateRequest;
import com.shyashyashya.refit.domain.qnaset.service.temp.GeminiGenerateResponse;
import com.shyashyashya.refit.domain.qnaset.service.temp.StarAnalysisGeminiResponse;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class StarAnalysisService {

    private final QnaSetRepository qnaSetRepository;
    private final StarAnalysisRepository starAnalysisRepository;

    private final RequestUserContext requestUserContext;
    private final InterviewValidator interviewValidator;
    private final WebClient webClient;

    private final ObjectMapper objectMapper;
    private final TransactionTemplate transactionTemplate;

    private QnaSet getValidatedQnaSetForUser(Long qnaSetId) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        User requestUser = requestUserContext.getRequestUser();
        Interview interview = qnaSet.getInterview();
        interviewValidator.validateInterviewOwner(interview, requestUser);

        return qnaSet;
    }

    @Transactional
    public Mono<StarAnalysisDto> createStarAnalysisLongPoll(Long qnaSetId) {
        StarAnalysis starAnalysis = createInProgressStarAnalysisTx(qnaSetId);

        final String GEMINI_API_URL =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";
        final String GEMINI_API_KEY = System.getenv("GEMINI_API_KEY");

        String prompt = buildPrompt(starAnalysis.getQnaSet());
        GeminiGenerateRequest requestBody = GeminiGenerateRequest.ofText(prompt);

        return webClient
                .post()
                .uri(GEMINI_API_URL)
                .header("x-goog-api-key", GEMINI_API_KEY)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GeminiGenerateResponse.class)
                .timeout(Duration.ofSeconds(30))
                .flatMap(rsp -> Mono.fromCallable(() -> onRequestSuccess(starAnalysis.getId(), rsp))
                        .subscribeOn(boundedElastic()))
                .onErrorResume(err -> Mono.fromCallable(() -> onRequestFail(starAnalysis.getId(), err))
                        .subscribeOn(boundedElastic()));

        // subscribeOn(boundedElastic())의 역할:
        // 블로킹 가능성이 있는 작업을 event-loop(Netty)가 아닌 별도의 boundedElastic 스레드 풀에서 실행되도록 함
        // 리액티브에서는 event-loop에서 DB/파일/긴 CPU 작업을 하면 전체 성능이 망가질 수 있음
    }

    @Transactional
    protected StarAnalysis createInProgressStarAnalysisTx(Long qnaSetId) {
        // QnaSet qnaSet = getValidatedQnaSetForUser(qnaSetId);
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        // TODO Race Condition 방어용 unique 조건
        if (starAnalysisRepository.existsByQnaSet(qnaSet)) {
            throw new CustomException(STAR_ANALYSIS_CREATION_ALREADY_IN_PROGRESS);
        }

        return starAnalysisRepository.save(StarAnalysis.createInProgressStarAnalysis(qnaSet));
    }

    @Transactional
    public StarAnalysisDto onRequestSuccess(Long starAnalysisId, GeminiGenerateResponse rsp) {
        String text = rsp.firstText().orElse("");

        log.info("[Gemini Response text]\n" + text);
        log.info("start parse Gemini response");

        StarAnalysisGeminiResponse geminiResponse;
        try {
            geminiResponse = objectMapper.readValue(text, StarAnalysisGeminiResponse.class);

            // TODO 임시 transaction template
            StarAnalysis updatedStar = transactionTemplate.execute(status -> {
                StarAnalysis starAnalysis = starAnalysisRepository
                        .findById(starAnalysisId)
                        .orElseThrow(
                                // new CustomException(STAR_ANALYSIS_NOT_FOUND)
                                );
                starAnalysis.update(
                        geminiResponse.getS(),
                        geminiResponse.getT(),
                        geminiResponse.getA(),
                        geminiResponse.getR(),
                        geminiResponse.getOverallSummary());
                return starAnalysis;
            });

            return StarAnalysisDto.from(updatedStar);
        } catch (JsonProcessingException e) {
            throw new CustomException(STAR_ANALYSIS_PARSING_FAILED);
        }
    }

    private StarAnalysisDto onRequestFail(Long starAnalysisId, Throwable err) {
        return null;
    }

    private String buildPrompt(QnaSet qnaSet) {
        return PROMPT_TEMPLATE
                .replace("{question}", qnaSet.getQuestionText())
                .replace("{answer}", qnaSet.getAnswerText());
    }

    private static final String PROMPT_TEMPLATE = """
            너는 면접 답변을 구조적으로 분석하는 도우미다.
            답변의 좋고 나쁨을 평가하거나 점수화하지 말고,
            STAR 기법 기준으로 구조적 요소의 포함 수준만 판단하라.

            STAR 정의는 다음과 같다:

            - Situation (S): 상황, 배경, 문제 발생 맥락
              → 언제, 어떤 환경에서, 어떤 문제가 발생했는지가 제3자가 이해 가능해야 한다.

            - Task (T): 당시 본인의 역할, 책임, 해결해야 했던 과제
              → 팀이 아닌 ‘본인’에게 주어진 역할이나 책임이 명확히 드러나야 한다.

            - Action (A): 본인이 실제로 수행한 구체적인 행동
              → 단순 참여가 아니라, 무엇을 어떻게 했는지가 드러나야 한다.

            - Result (R): 행동의 결과, 성과, 변화 또는 배운 점
              → 수치, 전후 비교, 명확한 변화 중 하나 이상이 포함되어야 한다.

            ---

            각 요소는 아래 3단계 중 하나로 판단한다:

            - "PRESENT"
              → 해당 요소가 명시적으로 언급되었고,
                내용이 구체적이며 제3자가 읽어도 충분히 이해 가능하다.

            - "INSUFFICIENT"
              → 요소가 언급되었으나,
                추상적이거나 설명이 짧아 맥락·행동·결과가 충분히 드러나지 않는다.

            - "ABSENT"
              → 해당 요소에 대한 언급이 전혀 없다.

            ---

            판단 시 공통 규칙:

            - 암시적 언급은 반드시 "INSUFFICIENT"으로 판단한다.
            - 역할, 행동, 결과가 불명확한 경우 "PRESENT"으로 판단하지 마라.
            - 단순한 표현
              (예: “회의를 진행했다”, “문제가 줄었다”, “잘 마무리되었다”)는
              구체적 설명이 없을 경우 반드시 "INSUFFICIENT"이다.
            - 판단이 애매한 경우에는 반드시 "INSUFFICIENT"으로 판단하라.
            - 평가, 점수화, 조언은 하지 말고 구조적 판단만 수행한다.

            ---

            아래 면접 답변을 STAR 기준으로 분석하라.

            [면접 질문]
            {question}

            [면접 답변]
            {answer}
            ---

            반드시 아래 JSON 형식으로만 출력하라.
            JSON 외의 텍스트는 절대 출력하지 마라.

            {
              "S": "PRESENT | INSUFFICIENT | ABSENT",
              "T": "PRESENT | INSUFFICIENT | ABSENT",
              "A": "PRESENT | INSUFFICIENT | ABSENT",
              "R": "PRESENT | INSUFFICIENT | ABSENT",
              "overall_summary": "string"
            }
            """;
}
