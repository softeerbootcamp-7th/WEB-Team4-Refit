package com.shyashyashya.refit.domain.interview.dto.response;

import com.shyashyashya.refit.domain.company.model.Company;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import java.time.LocalDateTime;

public record InterviewDto(
        Long interviewId,
        InterviewType interviewType,
        LocalDateTime interviewStartAt,
        InterviewResultStatus interviewResultStatus,
        String interviewRawText,
        String companyName,
        Long jobCategoryId,
        String jobCategoryName,
        LocalDateTime updatedAt,
        LocalDateTime createdAt) {
    public static InterviewDto from(Interview interview) {
        Company company = interview.getCompany();
        JobCategory jobCategory = interview.getJobCategory();

        return new InterviewDto(
                interview.getId(),
                interview.getInterviewType(),
                interview.getStartAt(),
                interview.getResultStatus(),
                interview.getRawText(),
                company.getName(),
                jobCategory.getId(),
                jobCategory.getName(),
                interview.getUpdatedAt(),
                interview.getCreatedAt());
    }
}
