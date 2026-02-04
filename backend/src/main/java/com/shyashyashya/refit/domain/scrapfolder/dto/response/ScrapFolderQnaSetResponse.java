package com.shyashyashya.refit.domain.scrapfolder.dto.response;

import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.qnaset.dto.QnaSetSimpleDto;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record ScrapFolderQnaSetResponse(InterviewDto interview, QnaSetSimpleDto qnaSet) {

    public static ScrapFolderQnaSetResponse from(QnaSet qnaSet, Interview interview) {
        return ScrapFolderQnaSetResponse.builder()
            .interview(InterviewDto.from(interview))
            .qnaSet(QnaSetSimpleDto.from(qnaSet))
            .build();
    }
}
