package com.shyashyashya.refit.domain.interview.dto.response;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record QnaSetCreateResponse(@NotNull Long qnaSetId) {
    public static QnaSetCreateResponse from(QnaSet qnaSet) {
        return QnaSetCreateResponse.builder().qnaSetId(qnaSet.getId()).build();
    }
}
