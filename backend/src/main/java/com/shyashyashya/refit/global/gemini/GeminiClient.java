package com.shyashyashya.refit.global.gemini;

import com.shyashyashya.refit.global.gemini.dto.GeminiBatchEmbeddingRequest;
import com.shyashyashya.refit.global.gemini.dto.GeminiBatchEmbeddingResponse;
import com.shyashyashya.refit.global.gemini.dto.GeminiEmbeddingRequest;
import com.shyashyashya.refit.global.gemini.dto.GeminiEmbeddingResponse;
import com.shyashyashya.refit.global.gemini.dto.GeminiGenerateRequest;
import com.shyashyashya.refit.global.gemini.dto.GeminiGenerateResponse;
import com.shyashyashya.refit.global.property.GeminiProperty;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Slf4j
@Component
public class GeminiClient {

    private static final String EMBEDDING_ENDPOINT =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent";

    private static final String EMBEDDING_BATCH_ENDPOINT =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents";

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

    public CompletableFuture<GeminiBatchEmbeddingResponse> sendAsyncBatchEmbeddingRequest(
            GeminiBatchEmbeddingRequest requestBody) {
        return webClient
                .post()
                .uri(EMBEDDING_BATCH_ENDPOINT)
                .header("x-goog-api-key", geminiProperty.apiKey())
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GeminiBatchEmbeddingResponse.class)
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
