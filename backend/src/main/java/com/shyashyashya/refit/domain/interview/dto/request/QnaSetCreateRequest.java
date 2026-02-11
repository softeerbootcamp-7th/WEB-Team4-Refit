package com.shyashyashya.refit.domain.interview.dto.request;

import static com.shyashyashya.refit.domain.qnaset.constant.QnaSetConstant.QUESTION_TEXT_MAX_LENGTH;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record QnaSetCreateRequest(
        @NotBlank @Size(max = QUESTION_TEXT_MAX_LENGTH) String questionText,
        @NotBlank String answerText) {}
