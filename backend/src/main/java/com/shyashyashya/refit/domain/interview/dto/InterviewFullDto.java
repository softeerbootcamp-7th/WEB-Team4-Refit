package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.interview.model.QnaSet;
import com.shyashyashya.refit.domain.interview.model.QnaSetSelfReview;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public record InterviewFullDto(
        @NotNull Long interviewId,
        @NotNull InterviewType interviewType,
        @NotNull LocalDateTime interviewStartAt,
        @NotNull InterviewResultStatus interviewResultStatus,
        @NotNull String company,
        @NotNull Long industryId,
        @NotNull Long jobCategoryId,
        @Size(max = 50) String JobRole,
        @NotNull LocalDateTime updatedAt,
        @Size(max = 2048) String pdfUrl,
        @NotNull List<QnaSetDto> qnaSets
        ) {
    public static InterviewFullDto from(Interview interview, List<QnaSetDto> qnaSetDtos) {
        return new InterviewFullDto(
                interview.getId(),
                interview.getInterviewType(),
                interview.getStartAt(),
                interview.getResultStatus(),
                interview.getCompany().getName(),
                interview.getIndustry().getId(),
                interview.getJobCategory().getId(),
                interview.getJobRole(),
                interview.getUpdatedAt(),
                interview.getPdfUrl(),
                qnaSetDtos
        );
    }
}
