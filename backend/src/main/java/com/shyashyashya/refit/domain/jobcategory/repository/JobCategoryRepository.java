package com.shyashyashya.refit.domain.jobcategory.repository;

import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface JobCategoryRepository extends JpaRepository<JobCategory, Long> {
    long countByIdIn(Collection<Long> ids);
}
