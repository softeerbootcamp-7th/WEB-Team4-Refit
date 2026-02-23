package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.company.model.Company;
import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record InterviewDto(
        @NotNull Long interviewId,
        @NotNull InterviewType interviewType,
        @NotNull LocalDateTime interviewStartAt,
        @NotNull InterviewResultStatus interviewResultStatus,
        @NotNull InterviewReviewStatus interviewReviewStatus,
        String interviewRawText,
        @NotNull String companyName,
        String companyLogoUrl,
        @NotNull Long industryId,
        @NotNull String industryName,
        @NotNull Long jobCategoryId,
        @NotNull String jobCategoryName,
        @NotNull LocalDateTime updatedAt,
        @NotNull LocalDateTime createdAt) {
    public static InterviewDto from(Interview interview) {
        Company company = interview.getCompany();
        Industry industry = interview.getIndustry();
        JobCategory jobCategory = interview.getJobCategory();

        return new InterviewDto(
                interview.getId(),
                interview.getInterviewType(),
                interview.getStartAt(),
                interview.getResultStatus(),
                interview.getReviewStatus(),
                interview.getRawText(),
                company.getName(),
                company.getLogoUrl(),
                industry.getId(),
                industry.getName(),
                jobCategory.getId(),
                jobCategory.getName(),
                interview.getUpdatedAt(),
                interview.getCreatedAt());
    }
}
