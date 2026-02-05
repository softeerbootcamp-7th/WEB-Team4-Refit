package com.shyashyashya.refit.domain.qnaset.dto.response;

import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.qnaset.dto.QnaSetSimpleDto;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record QnaSetSearchResponse(InterviewDto interviewInfo, QnaSetSimpleDto qnaSetInfo) {

    public static QnaSetSearchResponse from(QnaSet qnaSet) {
        return QnaSetSearchResponse.builder()
                .interviewInfo(InterviewDto.from(qnaSet.getInterview()))
                .qnaSetInfo(QnaSetSimpleDto.from(qnaSet))
                .build();
    }
}
