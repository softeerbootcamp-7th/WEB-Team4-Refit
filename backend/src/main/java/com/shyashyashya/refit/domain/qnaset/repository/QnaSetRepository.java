package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetCategoryResponse;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;
import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;
import com.shyashyashya.refit.domain.user.model.User;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QnaSetRepository extends JpaRepository<QnaSet, Long> {

    // TODO : queryDSL 적용
    @Query("""
        SELECT q
          FROM QnaSet q
         WHERE q.interview.user = :user
    """)
    List<QnaSet> findAllByUser(User user);

    // TODO : queryDSL 적용
    @Query("""
        SELECT q
          FROM QnaSet q
         WHERE q.interview.user = :user
           AND q.qnaSetCategory = :qnaSetCategory
    """)
    Page<QnaSet> findAllByUserAndQnaSetCategory(User user, QnaSetCategory qnaSetCategory, Pageable pageable);

    // TODO : queryDSL 적용
    @Query("""
        SELECT q
          FROM QnaSet q
          JOIN StarAnalysis s
         WHERE q.interview.user = :user
           AND q.questionText LIKE %:keyword%
           AND s.qnaSet = q
           AND s.sInclusionLevel IN :sInclusionLevel
           AND s.tInclusionLevel IN :tInclusionLevel
           AND s.aInclusionLevel IN :aInclusionLevel
           AND s.rInclusionLevel IN :rInclusionLevel
    """)
    Page<QnaSet> searchQnaSet(User user, String keyword,
                              List<StarInclusionLevel> sInclusionLevels,
                              List<StarInclusionLevel> tInclusionLevels,
                              List<StarInclusionLevel> aInclusionLevels,
                              List<StarInclusionLevel> rInclusionLevels,
                              Pageable pageable);
}
