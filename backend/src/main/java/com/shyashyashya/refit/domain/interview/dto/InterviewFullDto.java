package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetSelfReview;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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
        @NotNull List<QnaSetDto> qnaSets) {
    public static InterviewFullDto fromInterviewWithEmptyQnaSets(Interview interview) {
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
                List.of());
    }

    public static InterviewFullDto fromInterviewWithQnaSets(
            Interview interview,
            List<QnaSet> qnaSets,
            Map<Long, QnaSetSelfReview> selfReviewMap,
            Map<Long, StarAnalysisDto> starAnalysisDtoMap) {
        List<QnaSetDto> qnaSetDtos = qnaSets.stream()
                .map(qnaSet -> {
                    Long qnaSetId = qnaSet.getId();
                    QnaSetSelfReview selfReview = selfReviewMap.get(qnaSetId);
                    StarAnalysisDto starAnalysisDto = starAnalysisDtoMap.get(qnaSetId);
                    return QnaSetDto.from(qnaSet, selfReview, starAnalysisDto);
                })
                .toList();

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
                qnaSetDtos);
    }
}
