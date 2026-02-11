package com.shyashyashya.refit.domain.qnaset.service;

import com.shyashyashya.refit.domain.interview.dto.StarAnalysisDto;
import com.shyashyashya.refit.domain.qnaset.constant.StarAnalysisGeneratePrompt;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.ErrorCode;
import com.shyashyashya.refit.global.gemini.GeminiClient;
import com.shyashyashya.refit.global.gemini.GeminiGenerateRequest;
import com.shyashyashya.refit.global.gemini.GeminiGenerateResponse;
import java.util.concurrent.CompletableFuture;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StarAnalysisAsyncService {

    private final StarAnalysisService starAnalysisService;
    private final GeminiClient geminiClient;
    private final StarAnalysisGeneratePrompt starAnalysisGeneratePrompt;

    public CompletableFuture<StarAnalysisDto> createStarAnalysis(Long qnaSetId) {

        QnaSet qnaSet = starAnalysisService.getValidatedQnaSetForUser(qnaSetId);
        StarAnalysis starAnalysis = starAnalysisService.createInProgressStarAnalysisTx(qnaSet);

        String prompt = starAnalysisGeneratePrompt.buildPrompt(qnaSet);
        // log.info("Prompt: \n" + prompt);
        GeminiGenerateRequest requestBody = GeminiGenerateRequest.ofText(prompt);

        CompletableFuture<GeminiGenerateResponse> reqFuture = geminiClient.createGeminiRequest(requestBody);

        return reqFuture
                .thenApplyAsync(geminiRsp -> starAnalysisService.onRequestSuccess(starAnalysis.getId(), geminiRsp))
                .exceptionally(e -> {
                    starAnalysisService.onRequestFail(starAnalysis.getId(), e);
                    throw new CustomException(ErrorCode.STAR_ANALYSIS_CREATE_FAILED);
                });
    }
}
