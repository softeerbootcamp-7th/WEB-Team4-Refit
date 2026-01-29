package com.shyashyashya.refit.domain.interview.dto.request;

import com.shyashyashya.refit.domain.interview.model.InterviewType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record InterviewCreateRequest(
        @NotNull LocalDateTime startAt,
        @NotNull InterviewType interviewType,
        @NotNull String companyName,
        @NotNull Long industryId,
        @NotNull Long jobCategoryId,
        @NotNull String jobRole) {}
