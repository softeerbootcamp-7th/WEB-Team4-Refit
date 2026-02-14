package com.shyashyashya.refit.domain.qnaset.service;

import static com.shyashyashya.refit.domain.qnaset.constant.StarAnalysisConstant.STAR_ANALYSIS_CREATE_REQUEST_TIMEOUT_SEC;
import static com.shyashyashya.refit.global.exception.ErrorCode.STAR_ANALYSIS_CREATE_FAILED;
import static com.shyashyashya.refit.global.exception.ErrorCode.STAR_ANALYSIS_PARSING_FAILED;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shyashyashya.refit.domain.interview.dto.StarAnalysisDto;
import com.shyashyashya.refit.domain.qnaset.constant.StarAnalysisPromptGenerator;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.gemini.GeminiClient;
import com.shyashyashya.refit.global.gemini.GeminiGenerateRequest;
import com.shyashyashya.refit.global.gemini.GeminiGenerateResponse;
import com.shyashyashya.refit.global.gemini.GenerateModel;
import com.shyashyashya.refit.global.gemini.StarAnalysisGeminiResponse;
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
    private final ObjectMapper objectMapper;

    public CompletableFuture<StarAnalysisDto> createStarAnalysis(Long qnaSetId) {
        QnaSet qnaSet = qnaSetService.getQnaSet(qnaSetId);
        Long starAnalysisId =
                starAnalysisService.createInProgressStarAnalysis(qnaSet).getId();

        String prompt = starAnalysisGeneratePrompt.buildPrompt(qnaSet);
        GeminiGenerateRequest requestBody = GeminiGenerateRequest.from(prompt);

        log.info("Send star analysis generate request to gemini. qnaSetId: {}", qnaSetId);
        CompletableFuture<GeminiGenerateResponse> reqFuture =
                // geminiClient.sendAsyncRequest(requestBody, GenerateModel.GEMINI_2_5_FLASH_LITE,
                // STAR_ANALYSIS_CREATE_REQUEST_TIMEOUT_SEC);
                geminiClient.sendAsyncGenerateRequest(
                        requestBody, GenerateModel.GEMMA_3_27B_IT, STAR_ANALYSIS_CREATE_REQUEST_TIMEOUT_SEC);

        return reqFuture
                .thenApplyAsync(
                        response -> processSuccessRequest(starAnalysisId, qnaSetId, response),
                        geminiPostProcessExecutor)
                .exceptionally(e -> {
                    log.error("스타 분석 생성 요청이 실패하였습니다. {}", e.getCause(), e);
                    try {
                        starAnalysisService.deleteInProgressStarAnalysis(starAnalysisId);
                    } catch (Exception err) {
                        log.warn(err.getMessage(), err);
                    }
                    throw new CustomException(STAR_ANALYSIS_CREATE_FAILED);
                });
    }

    private StarAnalysisDto processSuccessRequest(
            Long starAnalysisId, Long qnaSetId, GeminiGenerateResponse geminiResponse) {
        log.info("Receive star analysis generate response from gemini. qnaSetId: {} \n{}", qnaSetId, geminiResponse);
        String jsonText =
                geminiResponse.firstText().orElseThrow(() -> new CustomException(STAR_ANALYSIS_PARSING_FAILED));
        StarAnalysisGeminiResponse starAnalysisGeminiResponse = parseStarAnalysisGeminiResponse(jsonText);
        StarAnalysis updated = starAnalysisService.updateStarAnalysis(starAnalysisId, starAnalysisGeminiResponse);
        return StarAnalysisDto.from(updated);
    }

    private StarAnalysisGeminiResponse parseStarAnalysisGeminiResponse(String text) {
        try {
            if (text.startsWith("```json\n")) {
                text = text.substring("```json\n".length());
            }
            if (text.endsWith("```")) {
                text = text.substring(0, text.length() - "```".length());
            }
            return objectMapper.readValue(text, StarAnalysisGeminiResponse.class);
        } catch (JsonProcessingException e) {
            throw new CustomException(STAR_ANALYSIS_PARSING_FAILED);
        }
    }
}
