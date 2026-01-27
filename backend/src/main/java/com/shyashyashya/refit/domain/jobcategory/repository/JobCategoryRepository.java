package com.shyashyashya.refit.domain.jobcategory.repository;

import com.shyashyashya.refit.domain.jobcategory.JobCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobCategoryRepository extends JpaRepository<JobCategory, Long> {}
