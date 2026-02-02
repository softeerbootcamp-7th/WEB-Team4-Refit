package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetSelfReview;

public record QnaSetDto(
        Long qnaSetId,
        Long interviewId,
        String questionText,
        String answerText,
        String qnaSetSelfReviewText,
        StarAnalysisDto starAnalysis,
        Boolean isMarkedDifficult) {
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
