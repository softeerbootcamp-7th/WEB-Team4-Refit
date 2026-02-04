package com.shyashyashya.refit.domain.interview.dto.request;

import static com.shyashyashya.refit.domain.interview.constant.InterviewConstant.KPT_TEXT_MAX_LENGTH;

import jakarta.validation.constraints.Size;

public record KptSelfReviewUpdateRequest(
        @Size(max = KPT_TEXT_MAX_LENGTH) String keepText,
        @Size(max = KPT_TEXT_MAX_LENGTH) String problemText,
        @Size(max = KPT_TEXT_MAX_LENGTH) String tryText) {}
