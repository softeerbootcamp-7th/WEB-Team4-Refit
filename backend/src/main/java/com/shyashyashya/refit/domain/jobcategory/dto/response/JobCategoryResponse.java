package com.shyashyashya.refit.domain.jobcategory.dto.response;

import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;

public record JobCategoryResponse(Long jobCategoryId, String jobCategoryName) {
    public static JobCategoryResponse from(JobCategory jobCategory) {
        return new JobCategoryResponse(jobCategory.getId(), jobCategory.getName());
    }
}
