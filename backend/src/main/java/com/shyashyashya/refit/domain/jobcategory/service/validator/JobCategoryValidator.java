package com.shyashyashya.refit.domain.jobcategory.service.validator;

import static com.shyashyashya.refit.global.exception.ErrorCode.JOB_CATEGORY_PARTIALLY_NOT_FOUND;

import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JobCategoryValidator {

    private final JobCategoryRepository jobCategoryRepository;

    public void validateJobCategoriesAllExist(List<Long> jobCategoryIds) {
        if (jobCategoryIds == null || jobCategoryIds.isEmpty()) {
            return;
        }

        long count = jobCategoryRepository.countByIdIn(jobCategoryIds);
        if (count != jobCategoryIds.size()) {
            throw new CustomException(JOB_CATEGORY_PARTIALLY_NOT_FOUND);
        }
    }
}
