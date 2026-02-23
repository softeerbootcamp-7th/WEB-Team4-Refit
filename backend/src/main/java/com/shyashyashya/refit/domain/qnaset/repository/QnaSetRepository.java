package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;
import com.shyashyashya.refit.domain.user.model.User;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface QnaSetRepository extends JpaRepository<QnaSet, Long>, QnaSetCustomRepository {

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

    @Query("""
        SELECT q
          FROM QnaSet q
         WHERE q.interview.user = :user
           AND q.qnaSetCategory = :qnaSetCategory
    """)
    Page<QnaSet> findAllByUserAndQnaSetCategory(User user, QnaSetCategory qnaSetCategory, Pageable pageable);

    List<QnaSet> findAllByInterview(Interview interview);

    @Query("""
        UPDATE QnaSet q
           SET q.qnaSetCategory = :category
         WHERE q.id IN :questionIds
    """)
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    void updateQnaSetCategoryQnaSetIdsIn(QnaSetCategory category, List<Long> questionIds);

    void deleteAllByInterview(Interview interview);

    @Query("""
        SELECT count(q)
          FROM QnaSet q
         WHERE q.interview.industry.id IN :industryIds
           AND q.interview.jobCategory.id IN :jobCategoryIds
    """)
    long countByIndustriesAndJobCategories(Set<Long> industryIds, Set<Long> jobCategoryIds);
}
