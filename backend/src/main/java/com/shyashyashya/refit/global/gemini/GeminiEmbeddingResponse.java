package com.shyashyashya.refit.global.gemini;

import java.util.List;

public record GeminiEmbeddingResponse(Embedding embedding) {

    public record Embedding(List<Float> values) {}
}
