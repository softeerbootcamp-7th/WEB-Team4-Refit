package com.shyashyashya.refit.domain.interview.dto.response;

import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import jakarta.validation.constraints.NotNull;

public record DashboardMyDifficultQuestionResponse(
        @NotNull String question, @NotNull InterviewDto interview) {

    public static DashboardMyDifficultQuestionResponse from(QnaSet qnaSet) {
        return new DashboardMyDifficultQuestionResponse(
                qnaSet.getQuestionText(), InterviewDto.from(qnaSet.getInterview()));
    }
}
