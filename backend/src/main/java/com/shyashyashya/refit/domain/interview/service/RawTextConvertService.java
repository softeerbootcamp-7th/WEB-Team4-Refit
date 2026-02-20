package com.shyashyashya.refit.domain.interview.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.GEMINI_RESPONSE_PARSING_FAILED;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_CONVERTING_FAILED;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_FOUND;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shyashyashya.refit.domain.interview.dto.response.ConvertResultResponse;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewConvertStatus;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetSelfReview;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetSelfReviewRepository;
import com.shyashyashya.refit.global.dto.ApiResponse;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.gemini.dto.GeminiGenerateResponse;
import com.shyashyashya.refit.global.gemini.dto.QnaSetsGeminiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RawTextConvertService {

    private final InterviewRepository interviewRepository;
    private final QnaSetRepository qnaSetRepository;
    private final QnaSetSelfReviewRepository qnaSetSelfReviewRepository;
    private final ConvertWaitingMap convertWaitingMap;
    private final ObjectMapper objectMapper;

    @Transactional
    public void processConvertSuccess(Long interviewId, GeminiGenerateResponse response) {
        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));

        String jsonText =
                response.firstJsonText().orElseThrow(() -> new CustomException(GEMINI_RESPONSE_PARSING_FAILED));
        QnaSetsGeminiResponse result = parseQnaSetsGeminiResponse(jsonText);

        result.interactions().forEach(qnaSetAndReview -> {
            QnaSet qnaSet = qnaSetRepository.save(
                    QnaSet.createNew(qnaSetAndReview.question(), qnaSetAndReview.answer(), interview));

            if (qnaSetAndReview.review() != null && !qnaSetAndReview.review().isEmpty()) {
                qnaSetSelfReviewRepository.save(QnaSetSelfReview.create(qnaSetAndReview.review(), qnaSet));
            }
        });

        interview.updateConvertStatus(InterviewConvertStatus.COMPLETED);
        interviewRepository.save(interview);

        // TODO 응답 부분을 컨트롤러로 분리
        // 대기중인 요청 깨우기
        convertWaitingMap.remove(interviewId).ifPresent(deferredResult -> {
            var body = ApiResponse.success(
                    COMMON200, ConvertResultResponse.of(interviewId, InterviewConvertStatus.COMPLETED));
            deferredResult.setResult(ResponseEntity.ok(body));
        });
    }

    @Transactional
    public void processConvertFailure(Long interviewId) {
        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));

        interview.updateConvertStatus(InterviewConvertStatus.NOT_CONVERTED);
        interview.rollbackToLogDraft();
        interviewRepository.save(interview);
        log.error("process failed request");

        convertWaitingMap.remove(interviewId).ifPresent(deferredResult -> {
            deferredResult.setErrorResult(new CustomException(INTERVIEW_CONVERTING_FAILED));
        });
    }

    private QnaSetsGeminiResponse parseQnaSetsGeminiResponse(String jsonText) {
        try {
            return objectMapper.readValue(jsonText, QnaSetsGeminiResponse.class);
        } catch (JsonProcessingException e) {
            throw new CustomException(GEMINI_RESPONSE_PARSING_FAILED);
        }
    }
}
