package com.shyashyashya.refit.domain.interview.dto.request;

import static com.shyashyashya.refit.domain.interview.constant.InterviewConstant.KEEP_TEXT_MAX_LENGTH;
import static com.shyashyashya.refit.domain.interview.constant.InterviewConstant.PROBLEM_TEXT_MAX_LENGTH;
import static com.shyashyashya.refit.domain.interview.constant.InterviewConstant.TRY_TEXT_MAX_LENGTH;

import jakarta.validation.constraints.Size;

public record KptSelfReviewUpdateRequest(
        @Size(max = KEEP_TEXT_MAX_LENGTH) String keepText,
        @Size(max = PROBLEM_TEXT_MAX_LENGTH) String problemText,
        @Size(max = TRY_TEXT_MAX_LENGTH) String tryText) {}
