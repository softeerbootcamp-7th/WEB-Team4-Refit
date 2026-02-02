package com.shyashyashya.refit.domain.qnaset.dto.response;

import com.shyashyashya.refit.domain.interview.dto.InterviewSimpleDto;
import com.shyashyashya.refit.domain.qnaset.dto.QnaSetSimpleDto;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;

public record QnaSetSearchResponse(InterviewSimpleDto interviewInfo, QnaSetSimpleDto qnaSetSimpleDto) {
    public static QnaSetSearchResponse from(QnaSet qnaSet) {
        return new QnaSetSearchResponse(InterviewSimpleDto.from(qnaSet.getInterview()), QnaSetSimpleDto.from(qnaSet));
    }
}
