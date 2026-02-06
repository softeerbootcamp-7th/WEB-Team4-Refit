package com.shyashyashya.refit.domain.qnaset.service;

import java.util.List;

public record GeminiRequest(
        List<Content> contents,
        GenerationConfig generationConfig
) {

    public record Content(List<Part> parts) {}
    public record Part(String text) {}
    public record GenerationConfig(double temperature) {}

    public static GeminiRequest ofText(String text) {
        return new GeminiRequest(
                List.of(new Content(List.of(new Part(text)))),
                new GenerationConfig(1.0)
        );
    }
}
