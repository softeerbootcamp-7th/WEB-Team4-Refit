package com.shyashyashya.refit.domain.qnaset.dto.request;

import jakarta.validation.constraints.Size;

public record QnaSetUpdateRequest(
        @Size(max = 200) String questionText,
        String answerText,
        @Size(max = 500) String selfReviewText) {}
