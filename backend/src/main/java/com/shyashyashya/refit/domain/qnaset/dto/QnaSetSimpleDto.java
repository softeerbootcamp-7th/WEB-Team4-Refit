package com.shyashyashya.refit.domain.qnaset.dto;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import jakarta.validation.constraints.NotNull;

public record QnaSetSimpleDto(
        @NotNull Long qnaSetId,
        @NotNull String questionText,
        @NotNull String answerText) {

    public static QnaSetSimpleDto from(QnaSet qnaSet) {
        return new QnaSetSimpleDto(qnaSet.getId(), qnaSet.getQuestionText(), qnaSet.getAnswerText());
    }
}
