package com.shyashyashya.refit.domain.interview.dto.response;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record QnaSetCreateResponse(Long qnaSetId) {
    public static QnaSetCreateResponse from(QnaSet qnaSet) {
        return new QnaSetCreateResponse(qnaSet.getId());
    }
}
