package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.interview.model.InterviewSelfReview;

public record KptReviewDto(String keepText, String problemText, String tryText) {

    public static KptReviewDto from(InterviewSelfReview interviewSelfReview) {
        return new KptReviewDto(
                interviewSelfReview.getKeepText(),
                interviewSelfReview.getProblemText(),
                interviewSelfReview.getTryText());
    }
}
