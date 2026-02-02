package com.shyashyashya.refit.domain.qnaset.dto.response;

import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;

public record FrequentQnaSetCategoryResponse(
        Long categoryId, String categoryName, Long frequentCount, Double cohesion) {

    public static FrequentQnaSetCategoryResponse of(QnaSetCategory category, Long frequentCount) {
        return new FrequentQnaSetCategoryResponse(
                category.getId(), category.getCategoryName(), frequentCount, category.getCohesion());
    }
}
