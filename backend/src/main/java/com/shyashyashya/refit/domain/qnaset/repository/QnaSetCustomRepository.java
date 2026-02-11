package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;
import com.shyashyashya.refit.domain.user.model.User;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface QnaSetCustomRepository {

    Page<QnaSet> searchByIndustriesAndJobCategories(
            List<Long> industryIds, List<Long> jobCategoryIds, Pageable pageable);

    Page<QnaSet> searchMyQnaSet(
            User user,
            String keyword,
            Boolean hasStarAnalysis,
            List<StarInclusionLevel> sInclusionLevels,
            List<StarInclusionLevel> tInclusionLevels,
            List<StarInclusionLevel> aInclusionLevels,
            List<StarInclusionLevel> rInclusionLevels,
            Pageable pageable);
}
