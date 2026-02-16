package com.shyashyashya.refit.domain.qnaset.dto.request;

import static com.shyashyashya.refit.domain.qnaset.constant.QnaSetConstant.QUESTION_TEXT_MAX_LENGTH;

import jakarta.validation.constraints.Size;

public record QnaSetUpdateRequest(
        @Size(max = QUESTION_TEXT_MAX_LENGTH) String questionText, String answerText) {}
