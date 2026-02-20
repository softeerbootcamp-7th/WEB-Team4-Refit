package com.shyashyashya.refit.domain.qnaset.dto.request;

import static com.shyashyashya.refit.domain.qnaset.constant.QnaSetConstant.ANSWER_TEXT_MAX_LENGTH;
import static com.shyashyashya.refit.domain.qnaset.constant.QnaSetConstant.QUESTION_TEXT_MAX_LENGTH;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record QnaSetUpdateRequest(
        @NotBlank @Size(max = QUESTION_TEXT_MAX_LENGTH) String questionText,
        @NotNull @Size(max = ANSWER_TEXT_MAX_LENGTH) String answerText) {}
