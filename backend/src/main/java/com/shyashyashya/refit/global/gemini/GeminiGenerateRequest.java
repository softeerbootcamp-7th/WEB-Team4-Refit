package com.shyashyashya.refit.global.gemini;

import java.util.List;

public record GeminiGenerateRequest(List<Content> contents, GenerationConfig generationConfig) {

    public record Content(List<Part> parts) {}

    public record Part(String text) {}

    public record GenerationConfig(double temperature) {}

    public static GeminiGenerateRequest ofText(String text) {
        return new GeminiGenerateRequest(List.of(new Content(List.of(new Part(text)))), new GenerationConfig(1.0));
    }
}
