package com.shyashyashya.refit.domain.jobcategory.dto.response;

import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import jakarta.validation.constraints.NotNull;

public record JobCategoryResponse(
        @NotNull Long jobCategoryId, @NotNull String jobCategoryName) {
    public static JobCategoryResponse from(JobCategory jobCategory) {
        return new JobCategoryResponse(jobCategory.getId(), jobCategory.getName());
    }
}
