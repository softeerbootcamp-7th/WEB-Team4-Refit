package com.shyashyashya.refit.domain.qnaset.dto.request;

import static com.shyashyashya.refit.domain.qnaset.constant.QnaSetConstant.QNA_SET_REVIEW_TEXT_MAX_LENGTH;

import jakarta.validation.constraints.Size;

public record QnaSetReviewUpdateRequest(
        @Size(max = QNA_SET_REVIEW_TEXT_MAX_LENGTH) String selfReviewText) {}
