package com.shyashyashya.refit.domain.qnaset.dto.response;

import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;
import jakarta.validation.constraints.NotNull;

public record FrequentQnaSetCategoryResponse(
        @NotNull Long categoryId,
        @NotNull String categoryName,
        @NotNull Long frequentCount,
        @NotNull Double cohesion) {

    public static FrequentQnaSetCategoryResponse of(QnaSetCategory category, Long frequentCount) {
        return new FrequentQnaSetCategoryResponse(
                category.getId(), category.getCategoryName(), frequentCount, category.getCohesion());
    }
}
