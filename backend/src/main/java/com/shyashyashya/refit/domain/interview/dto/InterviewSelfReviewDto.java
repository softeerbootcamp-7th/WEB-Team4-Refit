package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.interview.model.InterviewSelfReview;

public record InterviewSelfReviewDto(String keepText, String problemText, String tryText) {

    public static InterviewSelfReviewDto from(InterviewSelfReview interviewSelfReview) {
        return new InterviewSelfReviewDto(
                interviewSelfReview.getKeepText(),
                interviewSelfReview.getProblemText(),
                interviewSelfReview.getTryText());
    }
}
