package com.shyashyashya.refit.global.gemini.dto;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.List;

public record GeminiEmbeddingRequest(TaskType taskType, Content content, OutputDimensionality outputDimensionality) {

    public enum TaskType {
        SEMANTIC_SIMILARITY,
        CLASSIFICATION,
        CLUSTERING
    }

    public enum OutputDimensionality {
        D2048(2048),
        D1536(1536),
        D768(768),
        D512(512),
        D256(256),
        D128(128);

        private final int value;

        OutputDimensionality(int value) {
            this.value = value;
        }

        public static OutputDimensionality valueOf(int value) {
            for (OutputDimensionality dimensionality : values()) {
                if (dimensionality.value == value) {
                    return dimensionality;
                }
            }
            throw new IllegalArgumentException("Invalid output dimensionality value: " + value);
        }

        @JsonValue
        public int value() {
            return value;
        }
    }

    public record Content(List<Part> parts) {}

    public record Part(String text) {}

    public static GeminiEmbeddingRequest of(String text, TaskType taskType, OutputDimensionality outputDimensionality) {
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("text must not be blank");
        }

        Content content = new Content(List.of(new Part(text)));
        return new GeminiEmbeddingRequest(taskType, content, outputDimensionality);
    }
}
