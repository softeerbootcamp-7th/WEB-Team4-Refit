package com.shyashyashya.refit.global.gemini;

import com.shyashyashya.refit.global.property.GeminiProperty;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class GeminiClient {

    private final GeminiProperty geminiProperty;
    private final WebClient webClient;

    // TODO 요청 URL 상수로 분리, 임베딩 요청 고려
    private static final String GEMINI_API_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";
    //            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    //            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

    public CompletableFuture<GeminiGenerateResponse> sendAsyncRequest(
            GeminiGenerateRequest requestBody, Long timeoutSec) {
        return webClient
                .post()
                .uri(GEMINI_API_URL)
                .header("x-goog-api-key", geminiProperty.apiKey())
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GeminiGenerateResponse.class)
                .timeout(Duration.ofSeconds(timeoutSec))
                .toFuture();
    }
}
