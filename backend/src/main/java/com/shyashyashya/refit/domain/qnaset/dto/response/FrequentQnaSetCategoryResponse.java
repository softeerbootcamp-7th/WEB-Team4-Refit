package com.shyashyashya.refit.domain.qnaset.dto.response;

import com.querydsl.core.annotations.QueryProjection;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;
import jakarta.validation.constraints.NotNull;

public record FrequentQnaSetCategoryResponse(
        @NotNull Long categoryId,
        @NotNull String categoryName,
        @NotNull Long frequentCount,
        @NotNull Double cohesion) {

    @QueryProjection
    public FrequentQnaSetCategoryResponse(Long categoryId, String categoryName, Long frequentCount, Double cohesion) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.frequentCount = frequentCount;
        this.cohesion = cohesion;
    }
}
