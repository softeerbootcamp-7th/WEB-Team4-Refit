package com.shyashyashya.refit.domain.jobcategory.service.validator;

import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.ErrorCode;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.shyashyashya.refit.global.exception.ErrorCode.JOB_CATEGORY_PARTIALLY_NOT_FOUND;

@Component
public class JobCategoryValidator {

    public void validateJobCategoriesAllExist(List<JobCategory> jobCategories, List<Long> jobCategoryIds) {
        if (jobCategories.size() != jobCategoryIds.size()) {
            throw new CustomException(JOB_CATEGORY_PARTIALLY_NOT_FOUND);
        }
    }
}
