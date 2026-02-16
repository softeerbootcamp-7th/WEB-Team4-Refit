package com.shyashyashya.refit.domain.jobcategory.repository;

import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import java.util.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobCategoryRepository extends JpaRepository<JobCategory, Long> {
    long countByIdIn(Collection<Long> ids);
}
