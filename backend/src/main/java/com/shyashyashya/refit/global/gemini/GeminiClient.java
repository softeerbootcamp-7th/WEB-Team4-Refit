package com.shyashyashya.refit.global.gemini;

import java.util.concurrent.CompletableFuture;

import com.shyashyashya.refit.global.property.GeminiProperty;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class GeminiClient {

    private final GeminiProperty geminiProperty;
    private final WebClient webClient;

    private static final String GEMINI_API_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

    public CompletableFuture<GeminiGenerateResponse> createGeminiRequest(GeminiGenerateRequest requestBody) {
        return webClient
                .post()
                .uri(GEMINI_API_URL)
                .header("x-goog-api-key", geminiProperty.apiKey())
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GeminiGenerateResponse.class)
                .toFuture();
    }
}
