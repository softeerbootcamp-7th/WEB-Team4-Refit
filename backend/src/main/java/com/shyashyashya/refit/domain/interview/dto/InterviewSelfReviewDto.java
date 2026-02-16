package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.interview.model.InterviewSelfReview;
import jakarta.validation.constraints.NotNull;

public record InterviewSelfReviewDto(
        @NotNull String keepText,
        @NotNull String problemText,
        @NotNull String tryText) {

    public static InterviewSelfReviewDto from(InterviewSelfReview interviewSelfReview) {
        return new InterviewSelfReviewDto(
                interviewSelfReview.getKeepText(),
                interviewSelfReview.getProblemText(),
                interviewSelfReview.getTryText());
    }
}
