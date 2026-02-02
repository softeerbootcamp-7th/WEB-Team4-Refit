package com.shyashyashya.refit.domain.jobcategory.service;

import com.shyashyashya.refit.domain.jobcategory.dto.response.JobCategoryResponse;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobCategoryService {

    private final JobCategoryRepository jobCategoryRepository;

    public List<JobCategoryResponse> getJobCategories() {
        return jobCategoryRepository.findAll().stream()
                .map(JobCategoryResponse::from)
                .toList();
    }
}
