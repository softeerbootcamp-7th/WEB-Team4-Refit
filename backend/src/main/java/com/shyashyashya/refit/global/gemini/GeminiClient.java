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

    public CompletableFuture<GeminiGenerateResponse> sendAsyncGenerateRequest(
            GeminiGenerateRequest requestBody, GenerateModel model, Long timeoutSec) {
        return webClient
                .post()
                .uri(model.endpoint())
                .header("x-goog-api-key", geminiProperty.apiKey())
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GeminiGenerateResponse.class)
                .timeout(Duration.ofSeconds(timeoutSec))
                .toFuture();
    }

    private static final String EMBEDDING_ENDPOINT =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent";

    public CompletableFuture<GeminiEmbeddingResponse> sendAsyncEmbeddingRequest(
            GeminiEmbeddingRequest requestBody, Long timeoutSec) {
        return webClient
                .post()
                .uri(EMBEDDING_ENDPOINT)
                .header("x-goog-api-key", geminiProperty.apiKey())
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GeminiEmbeddingResponse.class)
                .timeout(Duration.ofSeconds(timeoutSec))
                .toFuture();
    }
}
