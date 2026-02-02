package com.shyashyashya.refit.domain.qnaset.dto.response;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;

// TODO : 프론트 개발 화면에 따라 변경 여지 존재
public record FrequentQnaSetResponse(String question) {
    public static FrequentQnaSetResponse from(QnaSet qnaSet) {
        // TODO : 질문에서 민감 정보 삭제
        return new FrequentQnaSetResponse(qnaSet.getQuestionText());
    }
}
