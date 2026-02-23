package com.shyashyashya.refit.global.gemini;

import com.shyashyashya.refit.global.gemini.dto.GeminiEmbeddingRequest;
import com.shyashyashya.refit.global.gemini.dto.GeminiEmbeddingResponse;
import com.shyashyashya.refit.global.gemini.dto.GeminiGenerateRequest;
import com.shyashyashya.refit.global.gemini.dto.GeminiGenerateResponse;
import com.shyashyashya.refit.global.property.GeminiProperty;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class GeminiClient {

    private final GeminiProperty geminiProperty;
    private final WebClient webClient;
    private final RestClient restClient;

    public GeminiClient(
            GeminiProperty geminiProperty,
            WebClient webClient,
            @Qualifier("geminiApiRestClient") RestClient restClient) {
        this.geminiProperty = geminiProperty;
        this.webClient = webClient;
        this.restClient = restClient;
    }

    public CompletableFuture<GeminiGenerateResponse> sendAsyncTextGenerateRequest(
            GeminiGenerateRequest requestBody, GenerateModel model) {
        return webClient
                .post()
                .uri(model.endpoint())
                .header("x-goog-api-key", geminiProperty.apiKey())
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GeminiGenerateResponse.class)
                .timeout(Duration.ofSeconds(geminiProperty.webClientRequestTimeoutSec()))
                .toFuture();
    }

    private static final String EMBEDDING_ENDPOINT =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent";

    public CompletableFuture<GeminiEmbeddingResponse> sendAsyncEmbeddingRequest(GeminiEmbeddingRequest requestBody) {
        return webClient
                .post()
                .uri(EMBEDDING_ENDPOINT)
                .header("x-goog-api-key", geminiProperty.apiKey())
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GeminiEmbeddingResponse.class)
                .timeout(Duration.ofSeconds(geminiProperty.webClientRequestTimeoutSec()))
                .toFuture();
    }

    public GeminiGenerateResponse sendTextGenerateRequest(GeminiGenerateRequest requestBody, GenerateModel model) {
        return restClient
                .post()
                .uri(model.endpoint())
                .header("x-goog-api-key", geminiProperty.apiKey())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(GeminiGenerateResponse.class);
    }
}
