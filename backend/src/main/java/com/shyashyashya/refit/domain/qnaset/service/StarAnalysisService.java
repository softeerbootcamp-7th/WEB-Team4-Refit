package com.shyashyashya.refit.domain.qnaset.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.QNA_SET_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.STAR_ANALYSIS_CREATION_ALREADY_IN_PROGRESS;

import com.shyashyashya.refit.domain.interview.dto.StarAnalysisDto;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysisStatus;
import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.qnaset.repository.StarAnalysisRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class StarAnalysisService {

    private final QnaSetRepository qnaSetRepository;
    private final StarAnalysisRepository starAnalysisRepository;

    private final RequestUserContext requestUserContext;
    private final InterviewValidator interviewValidator;
    private final WebClient webClient;

    private final Map<Long, DeferredResult<StarAnalysisDto>> waiting = new ConcurrentHashMap<>();

    @Transactional
    public StarAnalysisDto createStarAnalysis(Long qnaSetId) {
        QnaSet qnaSet = getValidatedQnaSetForUser(qnaSetId);

        StarAnalysis starAnalysis = starAnalysisRepository.findByQnaSet(qnaSet).orElseGet(() -> {
            StarAnalysis created = requestGeminiStarAnalysis(qnaSet);
            return starAnalysisRepository.save(created);
        });

        return StarAnalysisDto.from(starAnalysis);
    }

    private QnaSet getValidatedQnaSetForUser(Long qnaSetId) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        User requestUser = requestUserContext.getRequestUser();
        Interview interview = qnaSet.getInterview();
        interviewValidator.validateInterviewOwner(interview, requestUser);

        return qnaSet;
    }

    private StarAnalysis requestGeminiStarAnalysis(QnaSet qnaSet) {
        // TODO Gemini 요청 보내기

        return StarAnalysis.create(
                StarInclusionLevel.ABSENT,
                StarInclusionLevel.INSUFFICIENT,
                StarInclusionLevel.PRESENT,
                StarInclusionLevel.INSUFFICIENT,
                "전체 요약 텍스트 임시 가짜 데이터",
                StarAnalysisStatus.COMPLETED,
                qnaSet);
    }

    public DeferredResult<StarAnalysisDto> createStarAnalysisLongPoll(Long qnaSetId) {
        QnaSet qnaSet = getValidatedQnaSetForUser(qnaSetId);

        if (starAnalysisRepository.existsByQnaSet(qnaSet)) {
            throw new CustomException(STAR_ANALYSIS_CREATION_ALREADY_IN_PROGRESS);
        } else {
            StarAnalysis starAnalysis = starAnalysisRepository.save(StarAnalysis.createInProgressStarAnalysis(qnaSet));

            // TODO 하드코드 값 상수화
            Long timeoutMs = Duration.ofSeconds(20).toMillis();
            DeferredResult<StarAnalysisDto> deferredResult = new DeferredResult<>(timeoutMs);

            // waiting 맵의 용도는 무엇인가?
            waiting.put(starAnalysis.getId(), deferredResult);

            deferredResult.onTimeout(() -> {
                // TODO 타임아웃 동작 작성
            });

            deferredResult.onCompletion(() -> {
                // TODO 클라이언트 연결 끊긴 경우 동작 작성
            });

            callGeminiStarAnalysis(qnaSet);

            return deferredResult;
        }
    }

    private void callGeminiStarAnalysis(QnaSet qnaSet) {
        final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";
        final String GEMINI_API_KEY = System.getenv("GEMINI_API_KEY");

        webClient.post()
                .uri(GEMINI_API_URL)
                .header("x-goog-api-key", GEMINI_API_KEY)
                .header("Content-Type", "application/json")
                .bodyValue()
                .retrieve()
                .bodyToMono()
                .subscribe(
                        ok -> onRequestSuccess(),
                        err -> onRequestFail()
                );
    }

    private void onRequestSuccess() {

    }

    private void onRequestFail() {

    }
}
