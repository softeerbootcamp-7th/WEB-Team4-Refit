package com.shyashyashya.refit.domain.qnaset.service;

import static com.shyashyashya.refit.domain.qnaset.constant.StarAnalysisConstant.STAR_ANALYSIS_CREATE_REQUEST_TIMEOUT_SEC;

import com.shyashyashya.refit.domain.interview.dto.StarAnalysisDto;
import com.shyashyashya.refit.domain.qnaset.constant.StarAnalysisPromptGenerator;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.ErrorCode;
import com.shyashyashya.refit.global.gemini.GeminiClient;
import com.shyashyashya.refit.global.gemini.GeminiGenerateRequest;
import com.shyashyashya.refit.global.gemini.GeminiGenerateResponse;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StarAnalysisAsyncService {

    private final QnaSetService qnaSetService;
    private final StarAnalysisService starAnalysisService;
    private final GeminiClient geminiClient;
    private final StarAnalysisPromptGenerator starAnalysisGeneratePrompt;
    private final Executor geminiPostProcessExecutor;

    public CompletableFuture<StarAnalysisDto> createStarAnalysis(Long qnaSetId) {
        QnaSet qnaSet = qnaSetService.getQnaSet(qnaSetId);
        StarAnalysis starAnalysis = starAnalysisService.createInProgressStarAnalysis(qnaSet);

        String prompt = starAnalysisGeneratePrompt.buildPrompt(qnaSet);
        GeminiGenerateRequest requestBody = GeminiGenerateRequest.from(prompt);

        CompletableFuture<GeminiGenerateResponse> reqFuture =
                geminiClient.sendAsyncRequest(requestBody, STAR_ANALYSIS_CREATE_REQUEST_TIMEOUT_SEC);

        return reqFuture
                .thenApplyAsync(
                        geminiResponse -> starAnalysisService.onRequestSuccess(starAnalysis.getId(), geminiResponse),
                        geminiPostProcessExecutor)
                .exceptionally(e -> {
                    starAnalysisService.onRequestFail(starAnalysis.getId(), e);
                    throw new CustomException(ErrorCode.STAR_ANALYSIS_CREATE_FAILED);
                });
    }
}
