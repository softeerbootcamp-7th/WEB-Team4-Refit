package com.shyashyashya.refit.global.gemini.dto;

import java.util.List;

public record GeminiBatchEmbeddingResponse(List<Embedding> embeddings) {

    public record Embedding(List<Float> values) {}
}
