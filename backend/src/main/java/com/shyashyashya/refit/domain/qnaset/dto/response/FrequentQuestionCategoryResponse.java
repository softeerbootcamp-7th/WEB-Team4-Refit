package com.shyashyashya.refit.domain.qnaset.dto.response;

import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;

public record FrequentQuestionCategoryResponse(
        Long categoryId, String categoryName, Integer frequentCount, Double cohesion) {

    public static FrequentQuestionCategoryResponse of(QnaSetCategory category, Integer frequentCount, Double cohesion) {
        return new FrequentQuestionCategoryResponse(
                category.getId(), category.getCategoryName(), frequentCount, cohesion);
    }
}
