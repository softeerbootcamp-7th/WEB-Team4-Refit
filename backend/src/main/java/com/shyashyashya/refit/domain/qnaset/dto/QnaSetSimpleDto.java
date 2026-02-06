package com.shyashyashya.refit.domain.qnaset.dto;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;

public record QnaSetSimpleDto(Long qnaSetId, String questionText, String answerText) {

    public static QnaSetSimpleDto from(QnaSet qnaSet) {
        return new QnaSetSimpleDto(qnaSet.getId(), qnaSet.getQuestionText(), qnaSet.getAnswerText());
    }
}
