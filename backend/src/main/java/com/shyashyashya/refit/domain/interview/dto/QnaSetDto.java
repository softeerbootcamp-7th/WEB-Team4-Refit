package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.interview.model.QnaSet;
import com.shyashyashya.refit.domain.interview.model.QnaSetSelfReview;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record QnaSetDto(
        @NotNull Long qnaSetId,
        @NotNull Long interviewId,
        @NotNull @Size(max = 200) String questionText,
        @NotNull String answerText,
        @NotNull String qnaSetSelfReviewText,
        StarAnalysisDto starAnalysis,
        @NotNull Boolean isMarkedDifficult) {
    public static QnaSetDto from(QnaSet qnaSet, QnaSetSelfReview qnaSetSelfReview, StarAnalysisDto starAnalysisDto) {
        return new QnaSetDto(
                qnaSet.getId(),
                qnaSet.getInterview().getId(),
                qnaSet.getQuestionText(),
                qnaSet.getAnswerText(),
                qnaSetSelfReview.getSelfReviewText(),
                starAnalysisDto,
                qnaSet.isMarkedDifficult());
    }
}
