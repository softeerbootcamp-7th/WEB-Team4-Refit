package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.company.dto.CompanyDto;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record InterviewSimpleDto(
        @NotNull Long interviewId,
        @NotNull InterviewType interviewType,
        @NotNull InterviewReviewStatus interviewReviewStatus,
        @NotNull LocalDateTime interviewStartAt,
        @NotNull CompanyDto companyInfo,
        @NotNull String jobCategoryName,
        @NotNull LocalDateTime updatedAt) {
    public static InterviewSimpleDto from(Interview interview) {
        return new InterviewSimpleDto(
                interview.getId(),
                interview.getInterviewType(),
                interview.getReviewStatus(),
                interview.getStartAt(),
                CompanyDto.from(interview.getCompany()),
                interview.getJobCategory().getName(),
                interview.getUpdatedAt());
    }
}
