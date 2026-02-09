package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetSelfReview;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record InterviewFullDto(
        Long interviewId,
        InterviewType interviewType,
        LocalDateTime interviewStartAt,
        InterviewResultStatus interviewResultStatus,
        String company,
        Long industryId,
        Long jobCategoryId,
        String jobRole,
        LocalDateTime updatedAt,
        String pdfUrl,
        List<QnaSetDto> qnaSets,
        KptReviewDto kptReviewDto) {
    public static InterviewFullDto fromInterviewWithEmptyQnaSets(Interview interview) {
        return InterviewFullDto.builder()
                .interviewId(interview.getId())
                .interviewType(interview.getInterviewType())
                .interviewStartAt(interview.getStartAt())
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
            KptReviewDto kptReviewDto) {
        List<QnaSetDto> qnaSetDtos = qnaSets.stream()
                .map(qnaSet -> {
                    Long qnaSetId = qnaSet.getId();
                    QnaSetSelfReview selfReview = selfReviewMap.get(qnaSetId);
                    StarAnalysisDto starAnalysisDto = starAnalysisDtoMap.get(qnaSetId);
                    return QnaSetDto.from(qnaSet, selfReview, starAnalysisDto);
                })
                .toList();

        return InterviewFullDto.builder()
                .interviewId(interview.getId())
                .interviewType(interview.getInterviewType())
                .interviewStartAt(interview.getStartAt())
                .interviewResultStatus(interview.getResultStatus())
                .company(interview.getCompany().getName())
                .industryId(interview.getIndustry().getId())
                .jobCategoryId(interview.getJobCategory().getId())
                .jobRole(interview.getJobRole())
                .updatedAt(interview.getUpdatedAt())
                .pdfUrl(interview.getPdfUrl())
                .qnaSets(qnaSetDtos)
                .kptReviewDto(kptReviewDto)
                .build();
    }
}
