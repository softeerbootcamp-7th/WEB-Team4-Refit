package com.shyashyashya.refit.domain.qnaset.dto;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetSelfReview;
import jakarta.validation.constraints.NotNull;

public record QnaSetDto(
        @NotNull Long qnaSetId,
        @NotNull Long interviewId,
        @NotNull String questionText,
        @NotNull String answerText,
        @NotNull String qnaSetSelfReviewText,
        StarAnalysisDto starAnalysis,
        @NotNull Boolean isMarkedDifficult) {
    public static QnaSetDto from(QnaSet qnaSet, QnaSetSelfReview qnaSetSelfReview, StarAnalysisDto starAnalysisDto) {
        String selfReviewText = "";
        if (qnaSetSelfReview != null) {
            selfReviewText = qnaSetSelfReview.getSelfReviewText();
        }

        return new QnaSetDto(
                qnaSet.getId(),
                qnaSet.getInterview().getId(),
                qnaSet.getQuestionText(),
                qnaSet.getAnswerText(),
                selfReviewText,
                starAnalysisDto,
                qnaSet.isMarkedDifficult());
    }
}
