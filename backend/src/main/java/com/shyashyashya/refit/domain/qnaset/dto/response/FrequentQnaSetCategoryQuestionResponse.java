package com.shyashyashya.refit.domain.qnaset.dto.response;

import com.shyashyashya.refit.domain.interview.dto.InterviewSimpleDto;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;

public record FrequentQnaSetCategoryQuestionResponse(String question, InterviewSimpleDto interviewInfo) {

    public static FrequentQnaSetCategoryQuestionResponse from(QnaSet qnaSet) {
        return new FrequentQnaSetCategoryQuestionResponse(
                qnaSet.getQuestionText(), InterviewSimpleDto.from(qnaSet.getInterview()));
    }
}
