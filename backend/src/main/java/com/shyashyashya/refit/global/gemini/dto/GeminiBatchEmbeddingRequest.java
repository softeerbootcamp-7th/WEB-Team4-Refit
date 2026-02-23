package com.shyashyashya.refit.global.gemini.dto;

import com.shyashyashya.refit.global.gemini.dto.GeminiEmbeddingRequest.Content;
import com.shyashyashya.refit.global.gemini.dto.GeminiEmbeddingRequest.OutputDimensionality;
import com.shyashyashya.refit.global.gemini.dto.GeminiEmbeddingRequest.Part;
import com.shyashyashya.refit.global.gemini.dto.GeminiEmbeddingRequest.TaskType;
import java.util.List;

public record GeminiBatchEmbeddingRequest(List<GeminiEmbeddingRequest> requests) {

    public record GeminiEmbeddingRequest(
            String model, TaskType taskType, Content content, OutputDimensionality outputDimensionality) {

        public static GeminiEmbeddingRequest of(
                String text, TaskType taskType, OutputDimensionality outputDimensionality) {
            if (text == null || text.isBlank()) {
                throw new IllegalArgumentException("text must not be blank");
            }

            Content content = new Content(List.of(new Part(text)));
            return new GeminiEmbeddingRequest("models/gemini-embedding-001", taskType, content, outputDimensionality);
        }
    }
}
