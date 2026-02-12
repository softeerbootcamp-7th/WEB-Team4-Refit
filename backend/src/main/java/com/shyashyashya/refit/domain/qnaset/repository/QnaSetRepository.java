package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;
import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;
import com.shyashyashya.refit.domain.user.model.User;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QnaSetRepository extends JpaRepository<QnaSet, Long>, QnaSetCustomRepository {

    // TODO : queryDSL 적용
    @Query("""
        SELECT q
          FROM QnaSet q
         WHERE q.interview.user = :user
    """)
    List<QnaSet> findAllByUser(User user);

    @Query("""
        SELECT q
          FROM QnaSet q
         WHERE q.interview.industry = :industry
           AND q.interview.jobCategory = :jobCategory
    """)
    List<QnaSet> findAllByIndustryAndJobCategory(Industry industry, JobCategory jobCategory);

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
      LEFT JOIN StarAnalysis s ON s.qnaSet = q
     WHERE q.interview.user = :user
       AND (:keyword IS NULL OR q.questionText LIKE %:keyword%)
       AND (
             :hasStarAnalysis IS NULL
          OR (:hasStarAnalysis = TRUE  AND s IS NOT NULL)
          OR (:hasStarAnalysis = FALSE AND s IS NULL)
       )
       AND (
            s IS NULL
            OR (
                 (:sInclusionLevels IS NULL OR s.sInclusionLevel IN :sInclusionLevels)
             AND (:tInclusionLevels IS NULL OR s.tInclusionLevel IN :tInclusionLevels)
             AND (:aInclusionLevels IS NULL OR s.aInclusionLevel IN :aInclusionLevels)
             AND (:rInclusionLevels IS NULL OR s.rInclusionLevel IN :rInclusionLevels)
            )
       )
    """)
    Page<QnaSet> searchQnaSet(
            User user,
            String keyword,
            Boolean hasStarAnalysis,
            List<StarInclusionLevel> sInclusionLevels,
            List<StarInclusionLevel> tInclusionLevels,
            List<StarInclusionLevel> aInclusionLevels,
            List<StarInclusionLevel> rInclusionLevels,
            Pageable pageable);

    List<QnaSet> findAllByInterview(Interview interview);

    @Query("""
        SELECT q
          FROM QnaSet q
         WHERE q.interview.user = :user
           AND q.isMarkedDifficult = TRUE
    """)
    Page<QnaSet> findAllDifficultByUser(User user, Pageable pageable);
}
