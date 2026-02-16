package com.shyashyashya.refit.unit.jobcategory.service.validator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.domain.jobcategory.service.validator.JobCategoryValidator;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.ErrorCode;

import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JobCategoryValidatorTest {

    private JobCategoryRepository jobCategoryRepository;
    private JobCategoryValidator jobCategoryValidator;

    @BeforeEach
    void setUp() {
        jobCategoryRepository = mock(JobCategoryRepository.class);
        jobCategoryValidator = new JobCategoryValidator(jobCategoryRepository);
    }

    @Test
    void 제공된_모든_직군_ID에_해당하는_직군이_존재하면_검증에_성공한다() {
        // given
        Set<Long> existingJobCategoryIds = Set.of(1L, 2L, 3L);
        when(jobCategoryRepository.countByIdIn(existingJobCategoryIds)).thenReturn((long) existingJobCategoryIds.size());

        // when & then
        assertThatCode(() -> jobCategoryValidator.validateJobCategoriesAllExist(existingJobCategoryIds))
            .doesNotThrowAnyException();
    }

    @Test
    void 제공된_직군_ID_중_일부가_존재하지_않으면_검증에_실패하고_CustomException을_던진다() {
        // given
        Set<Long> jobCategoryIdsWithMissing = Set.of(1L, 2L, 99L); // 99L is missing
        when(jobCategoryRepository.countByIdIn(jobCategoryIdsWithMissing)).thenReturn(2L); // Only 2 exist

        // when & then
        assertThatThrownBy(() -> jobCategoryValidator.validateJobCategoriesAllExist(jobCategoryIdsWithMissing))
            .isInstanceOf(CustomException.class)
            .hasMessage(ErrorCode.JOB_CATEGORY_PARTIALLY_NOT_FOUND.getMessage());
    }

    @Test
    void 빈_리스트로_validateJobCategoriesAllExist를_호출하면_예외를_던지지_않는다() {
        // given
        Set<Long> emptyList = Set.of();

        // when & then
        assertThatCode(() -> jobCategoryValidator.validateJobCategoriesAllExist(emptyList))
            .doesNotThrowAnyException();
    }

    @Test
    void null_리스트로_validateJobCategoriesAllExist를_호출하면_예외를_던지지_않는다() {
        // given
        Set<Long> nullList = null;

        // when & then
        assertThatCode(() -> jobCategoryValidator.validateJobCategoriesAllExist(nullList))
            .doesNotThrowAnyException();
    }
}
