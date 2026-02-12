package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface QnaSetCustomRepository {

    Page<QnaSet> searchByIndustriesAndJobCategories(
            List<Long> industryIds, List<Long> jobCategoryIds, Pageable pageable);
}
