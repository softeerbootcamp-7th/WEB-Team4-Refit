package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.company.dto.CompanyDto;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import java.time.LocalDateTime;

public record InterviewSimpleDto(
        Long interviewId,
        InterviewReviewStatus interviewReviewStatus,
        InterviewType interviewType,
        LocalDateTime interviewStartAt,
        CompanyDto companyInfo,
        String jobCategoryName,
        LocalDateTime updatedAt) {
    public static InterviewSimpleDto from(Interview interview) {
        return new InterviewSimpleDto(
                interview.getId(),
                interview.getReviewStatus(),
                interview.getInterviewType(),
                interview.getStartAt(),
                CompanyDto.from(interview.getCompany()),
                interview.getJobCategory().getName(),
                interview.getUpdatedAt());
    }
}
