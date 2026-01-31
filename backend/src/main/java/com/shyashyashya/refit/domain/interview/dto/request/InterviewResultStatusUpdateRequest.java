package com.shyashyashya.refit.domain.interview.dto.request;

import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import jakarta.validation.constraints.NotNull;

public record InterviewResultStatusUpdateRequest(@NotNull InterviewResultStatus interviewResultStatus) {}
