package com.shyashyashya.refit.domain.qnaset.dto.event;

import lombok.Builder;

@Builder(access = lombok.AccessLevel.PRIVATE)
public record QuestionEmbeddingEvent(Long qnaSetId, String updateContent) {

    public static QuestionEmbeddingEvent of(Long qnaSetId, String updateContent) {
        return QuestionEmbeddingEvent.builder()
                .qnaSetId(qnaSetId)
                .updateContent(updateContent)
                .build();
    }
}
