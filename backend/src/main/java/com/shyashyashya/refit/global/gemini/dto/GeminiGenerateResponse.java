package com.shyashyashya.refit.global.gemini.dto;

import java.util.List;
import java.util.Optional;

public record GeminiGenerateResponse(List<Candidate> candidates) {

    public record Candidate(Content content) {}

    public record Content(List<Part> parts) {}

    public record Part(String text) {}

    public Optional<String> firstJsonText() {
        if (candidates == null || candidates.isEmpty()) return Optional.empty();
        var c0 = candidates.get(0);
        if (c0 == null
                || c0.content() == null
                || c0.content().parts() == null
                || c0.content().parts().isEmpty()
                || c0.content().parts().get(0).text() == null) return Optional.empty();

        String text = c0.content().parts().get(0).text();
        if (text.startsWith("```json\n")) {
            text = text.substring("```json\n".length());
        }
        if (text.endsWith("```")) {
            text = text.substring(0, text.length() - "```".length());
        }
        return Optional.of(text);
    }

    public String getText() {
        if (candidates == null || candidates.isEmpty()) return "";
        var c0 = candidates.get(0);
        if (c0 == null
            || c0.content() == null
            || c0.content().parts() == null
            || c0.content().parts().isEmpty()
            || c0.content().parts().get(0).text() == null) return "";

        return c0.content().parts().get(0).text();
    }
}
