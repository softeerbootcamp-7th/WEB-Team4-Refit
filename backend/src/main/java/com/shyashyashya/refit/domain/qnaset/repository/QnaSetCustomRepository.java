package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface QnaSetCustomRepository {

    Page<QnaSet> searchByIndustriesAndJobCategories(List<Long> industryIds, List<Long> jobCategoryIds, Pageable pageable);
}
