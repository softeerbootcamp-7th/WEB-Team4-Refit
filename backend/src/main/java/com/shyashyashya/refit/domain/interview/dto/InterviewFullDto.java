package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewSelfReview;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.qnaset.dto.QnaSetDto;
import com.shyashyashya.refit.domain.qnaset.dto.StarAnalysisDto;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetSelfReview;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record InterviewFullDto(
        @NotNull Long interviewId,
        @NotNull InterviewType interviewType,
        @NotNull LocalDateTime interviewStartAt,
        @NotNull InterviewReviewStatus interviewReviewStatus,
        @NotNull InterviewResultStatus interviewResultStatus,
        @NotNull String company,
        @NotNull Long industryId,
        @NotNull Long jobCategoryId,
        String jobRole,
        @NotNull LocalDateTime updatedAt,
        String pdfUrl,
        @NotNull List<QnaSetDto> qnaSets,
        InterviewSelfReviewDto interviewSelfReview) {
    public static InterviewFullDto fromInterviewWithEmptyQnaSets(Interview interview) {
        return InterviewFullDto.builder()
                .interviewId(interview.getId())
                .interviewType(interview.getInterviewType())
                .interviewStartAt(interview.getStartAt())
                .interviewReviewStatus(interview.getReviewStatus())
                .interviewResultStatus(interview.getResultStatus())
                .company(interview.getCompany().getName())
                .industryId(interview.getIndustry().getId())
                .jobCategoryId(interview.getJobCategory().getId())
                .jobRole(interview.getJobRole())
                .updatedAt(interview.getUpdatedAt())
                .pdfUrl(interview.getPdfUrl())
                .qnaSets(List.of())
                .build();
    }

    public static InterviewFullDto fromInterviewWithQnaSets(
            Interview interview,
            List<QnaSet> qnaSets,
            Map<Long, QnaSetSelfReview> selfReviewMap,
            Map<Long, StarAnalysisDto> starAnalysisDtoMap,
            InterviewSelfReview interviewSelfReview) {
        List<QnaSetDto> qnaSetDtos = qnaSets.stream()
                .map(qnaSet -> {
                    Long qnaSetId = qnaSet.getId();
                    QnaSetSelfReview selfReview = selfReviewMap.get(qnaSetId);
                    StarAnalysisDto starAnalysisDto = starAnalysisDtoMap.get(qnaSetId);
                    return QnaSetDto.from(qnaSet, selfReview, starAnalysisDto);
                })
                .toList();

        InterviewSelfReviewDto interviewSelfReviewDto = InterviewSelfReviewDto.from(interviewSelfReview);

        return InterviewFullDto.builder()
                .interviewId(interview.getId())
                .interviewType(interview.getInterviewType())
                .interviewStartAt(interview.getStartAt())
                .interviewReviewStatus(interview.getReviewStatus())
                .interviewResultStatus(interview.getResultStatus())
                .company(interview.getCompany().getName())
                .industryId(interview.getIndustry().getId())
                .jobCategoryId(interview.getJobCategory().getId())
                .jobRole(interview.getJobRole())
                .updatedAt(interview.getUpdatedAt())
                .pdfUrl(interview.getPdfUrl())
                .qnaSets(qnaSetDtos)
                .interviewSelfReview(interviewSelfReviewDto)
                .build();
    }
}
