package com.shyashyashya.refit.domain.interview.dto.request;

import com.shyashyashya.refit.domain.interview.model.InterviewType;
import java.time.LocalDateTime;

public record InterviewCreateRequest(
        LocalDateTime startAt,
        InterviewType interviewType,
        String companyName,
        Long industryId,
        Long jobCategoryId,
        String jobRole) {}
