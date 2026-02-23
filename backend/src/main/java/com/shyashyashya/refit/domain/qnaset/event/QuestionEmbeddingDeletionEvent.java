package com.shyashyashya.refit.domain.qnaset.event;

import lombok.Builder;

@Builder(access = lombok.AccessLevel.PRIVATE)
public record QuestionEmbeddingDeletionEvent(Long qnaSetId) {

    public static QuestionEmbeddingDeletionEvent of(Long qnaSetId) {
        return QuestionEmbeddingDeletionEvent.builder().qnaSetId(qnaSetId).build();
    }
}
