package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.interview.model.InterviewSelfReview;

public record KptReviewDto(Long kptReviewId, Long interviewId, String keepText, String problemText, String tryText) {

    public static KptReviewDto from(InterviewSelfReview interviewSelfReview) {
        return new KptReviewDto(
                interviewSelfReview.getId(),
                interviewSelfReview.getInterview().getId(),
                interviewSelfReview.getKeepText(),
                interviewSelfReview.getProblemText(),
                interviewSelfReview.getProblemText());
    }
}
