package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetCategoryResponse;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;
import com.shyashyashya.refit.domain.user.model.User;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface QnaSetCustomRepository {

    Page<QnaSet> searchByIndustriesAndJobCategories(Set<Long> industryIds, Set<Long> jobCategoryIds, Pageable pageable);

    Page<QnaSet> searchMyQnaSet(
            User user,
            String keyword,
            Boolean hasStarAnalysis,
            Set<StarInclusionLevel> sInclusionLevels,
            Set<StarInclusionLevel> tInclusionLevels,
            Set<StarInclusionLevel> aInclusionLevels,
            Set<StarInclusionLevel> rInclusionLevels,
            Pageable pageable);

    Page<FrequentQnaSetCategoryResponse> findFrequentQnaSetCategoryByUser(User user, Pageable pageable);
}
