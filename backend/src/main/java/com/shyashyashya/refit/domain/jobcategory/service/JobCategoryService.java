package com.shyashyashya.refit.domain.jobcategory.service;

import com.shyashyashya.refit.domain.jobcategory.dto.response.JobCategoryResponse;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobCategoryService {

    private final JobCategoryRepository jobCategoryRepository;

    @Transactional(readOnly = true)
    public List<JobCategoryResponse> getJobCategories() {
        return jobCategoryRepository.findAll().stream()
                .map(JobCategoryResponse::from)
                .toList();
    }
}
