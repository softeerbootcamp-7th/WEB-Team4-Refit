package com.shyashyashya.refit.global.util;

import static com.shyashyashya.refit.global.exception.ErrorCode.GEMINI_RESPONSE_PARSING_FAILED;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.gemini.GeminiClient;
import com.shyashyashya.refit.global.gemini.GenerateModel;
import com.shyashyashya.refit.global.gemini.dto.GeminiGenerateRequest;
import com.shyashyashya.refit.global.gemini.dto.GeminiGenerateResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class GeminiUtil {

    private final GeminiClient geminiClient;
    private final ObjectMapper objectMapper;

    public <T> T sendTextGenerateRequest(String prompt, Class<T> responseType) {
        GeminiGenerateRequest requestBody = GeminiGenerateRequest.from(prompt);
        GeminiGenerateResponse response =
                geminiClient.sendTextGenerateRequest(requestBody, GenerateModel.GEMMA_3_27B_IT);
        T result = parseGeminiResponse(response, responseType);

        log.debug("[createCategories] gemini response: {}", result);
        return result;
    }

    private <T> T parseGeminiResponse(GeminiGenerateResponse response, Class<T> targetClass) {
        try {
            String jsonText =
                    response.firstJsonText().orElseThrow(() -> new CustomException(GEMINI_RESPONSE_PARSING_FAILED));
            log.info("[parseGeminiResponse] raw json text: {}", jsonText);
            return objectMapper.readValue(jsonText, targetClass);
        } catch (JsonProcessingException e) {
            throw new CustomException(GEMINI_RESPONSE_PARSING_FAILED);
        }
    }
}
