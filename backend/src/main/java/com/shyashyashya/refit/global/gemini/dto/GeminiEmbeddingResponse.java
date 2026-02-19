package com.shyashyashya.refit.global.gemini.dto;

import java.util.List;

public record GeminiEmbeddingResponse(Embedding embedding) {

    public record Embedding(List<Float> values) {}
}
