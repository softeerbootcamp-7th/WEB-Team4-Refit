package com.shyashyashya.refit.domain.qnaset.dto.response;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record FrequentQnaSetResponse(
        @NotNull String industryName,
        @NotNull String jobCategoryName,
        @NotNull InterviewType interviewType,
        @NotNull LocalDateTime interviewStartAt,
        @NotNull String question) {
    public static FrequentQnaSetResponse from(QnaSet qnaSet) {
        // TODO : 질문에서 민감 정보 삭제
        Interview interview = qnaSet.getInterview();
        return FrequentQnaSetResponse.builder()
                .industryName(interview.getIndustry().getName())
                .jobCategoryName(interview.getJobCategory().getName())
                .interviewType(interview.getInterviewType())
                .interviewStartAt(interview.getStartAt())
                .question(qnaSet.getQuestionText())
                .build();
    }
}
