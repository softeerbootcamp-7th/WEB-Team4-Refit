package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.company.dto.CompanyDto;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import java.time.LocalDateTime;

public record InterviewSimpleDto(
        Long interviewId,
        InterviewType interviewType,
        LocalDateTime interviewStartAt,
        InterviewReviewStatus interviewReviewStatus, // TODO : 필드 삭제 논의
        InterviewResultStatus interviewResultStatus,
        CompanyDto companyInfo,
        Long jobCategoryId,
        String jobCategoryName,
        LocalDateTime updatedAt) {
    public static InterviewSimpleDto from(Interview interview) {
        return new InterviewSimpleDto(
                interview.getId(),
                interview.getInterviewType(),
                interview.getStartAt(),
                interview.getReviewStatus(),
                interview.getResultStatus(),
                CompanyDto.from(interview.getCompany()),
                interview.getJobCategory().getId(),
                interview.getJobCategory().getName(),
                interview.getUpdatedAt());
    }
}
