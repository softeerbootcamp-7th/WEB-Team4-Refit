package com.shyashyashya.refit.domain.qnaset.dto.response;

import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import jakarta.validation.constraints.NotNull;

public record MyDifficultQuestionResponse(
        @NotNull Long qnaSetId,
        @NotNull String question,
        @NotNull String answer,
        @NotNull InterviewDto interview) {

    public static MyDifficultQuestionResponse from(QnaSet qnaSet) {
        return new MyDifficultQuestionResponse(
                qnaSet.getId(),
                qnaSet.getQuestionText(),
                qnaSet.getAnswerText(),
                InterviewDto.from(qnaSet.getInterview()));
    }
}
