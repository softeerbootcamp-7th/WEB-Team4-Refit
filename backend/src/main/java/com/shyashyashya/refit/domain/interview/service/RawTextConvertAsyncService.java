package com.shyashyashya.refit.domain.interview.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_CONVERTING_IN_PROGRESS;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_CONVERTING_STATUS_IS_PENDING;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_FOUND;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.interview.dto.response.ConvertResultResponse;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewConvertStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.dto.ApiResponse;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.gemini.GeminiClient;
import com.shyashyashya.refit.global.gemini.GenerateModel;
import com.shyashyashya.refit.global.gemini.dto.GeminiGenerateRequest;
import com.shyashyashya.refit.global.gemini.dto.GeminiGenerateResponse;
import com.shyashyashya.refit.global.util.KeyLockUtil;
import com.shyashyashya.refit.global.util.PromptGenerateUtil;
import com.shyashyashya.refit.global.util.RequestUserContext;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.locks.ReentrantLock;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.async.DeferredResult;

@Service
@RequiredArgsConstructor
@Slf4j
public class RawTextConvertAsyncService {

    private final RequestUserContext requestUserContext;
    private final InterviewRepository interviewRepository;
    private final InterviewValidator interviewValidator;
    private final PromptGenerateUtil qnaSetPromptGenerator;
    private final GeminiClient geminiClient;
    private final RawTextConvertService rawTextConvertService;
    private final Executor geminiPostProcessExecutor;
    private final ConvertWaitingMap convertWaitingMap;
    private final KeyLockUtil<Long> interviewLock;

    @Transactional
    public void startRawTextConvertAsync(Long interviewId) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, requestUser);
        interviewValidator.validateInterviewReviewStatus(interview, List.of(InterviewReviewStatus.LOG_DRAFT));
        interviewValidator.validateInterviewConvertStatusIsNotConverted(interview);

        ReentrantLock lock = interviewLock.acquire(interviewId);
        try {
            interview.updateConvertStatus(InterviewConvertStatus.IN_PROGRESS);
            interview.completeLogging();

            String prompt = qnaSetPromptGenerator.buildInterviewRawTextConvertPrompt(interview);
            GeminiGenerateRequest requestBody = GeminiGenerateRequest.from(prompt);
            CompletableFuture<GeminiGenerateResponse> future =
                    geminiClient.sendAsyncTextGenerateRequest(requestBody, GenerateModel.GEMINI_3_FLASH);
            log.info("request sended");
            future.thenApplyAsync(
                            response -> {
                                rawTextConvertService.processConvertSuccess(interviewId, response);
                                return null;
                            },
                            geminiPostProcessExecutor)
                    .exceptionally(e -> {
                        log.error(e.getMessage(), e);
                        rawTextConvertService.processConvertFailure(interviewId);
                        return null;
                    });
        } finally {
            interviewLock.release(interviewId, lock);
        }
    }

    @Transactional(readOnly = true)
    public void handleRawTextConvertResultRequest(
            Long interviewId, DeferredResult<ResponseEntity<ApiResponse<ConvertResultResponse>>> deferredResult) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, requestUser);

        InterviewConvertStatus convertStatus = interview.getConvertStatus();
        if (convertStatus.equals(InterviewConvertStatus.COMPLETED)) {
            var body = ConvertResultResponse.of(interviewId, InterviewConvertStatus.COMPLETED);
            deferredResult.setResult(ResponseEntity.ok(ApiResponse.success(COMMON200, body)));
            return;
        }
        if (convertStatus.equals(InterviewConvertStatus.NOT_CONVERTED)) {
            throw new CustomException(INTERVIEW_CONVERTING_STATUS_IS_PENDING);
        }

        convertWaitingMap.put(interviewId, deferredResult);

        deferredResult.onTimeout(() -> {
            convertWaitingMap.remove(interviewId);
            throw new CustomException(INTERVIEW_CONVERTING_IN_PROGRESS);
        });

        deferredResult.onCompletion(() -> convertWaitingMap.remove(interviewId));
    }
}
