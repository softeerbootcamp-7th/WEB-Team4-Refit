package com.shyashyashya.refit.global.gemini;

import java.util.List;
import java.util.Optional;

public record GeminiGenerateResponse(List<Candidate> candidates) {

    public record Candidate(Content content) {}

    public record Content(List<Part> parts) {}

    public record Part(String text) {}

    public Optional<String> firstText() {
        if (candidates == null || candidates.isEmpty()) return Optional.empty();
        var c0 = candidates.get(0);
        if (c0 == null
                || c0.content() == null
                || c0.content().parts() == null
                || c0.content().parts().isEmpty()) return Optional.empty();
        return Optional.of(c0.content().parts().get(0).text());
    }
}
