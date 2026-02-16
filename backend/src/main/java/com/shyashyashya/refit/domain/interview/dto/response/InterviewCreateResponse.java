package com.shyashyashya.refit.domain.interview.dto.response;

import jakarta.validation.constraints.NotNull;

public record InterviewCreateResponse(@NotNull Long interviewId) {
}
