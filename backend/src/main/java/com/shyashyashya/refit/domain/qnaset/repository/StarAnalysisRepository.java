package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StarAnalysisRepository extends JpaRepository<StarAnalysis, Long> {

    void deleteByQnaSet(QnaSet qnaSet);

    boolean existsByQnaSet(QnaSet qnaSet);

    @Query("select s from StarAnalysis s where s.qnaSet.id in :qnaSetIds")
    List<StarAnalysis> findAllByQnaSetIdIn(@Param("qnaSetIds") List<Long> qnaSetIds);

    @Query("""
        DELETE
          FROM StarAnalysis s
         WHERE s.qnaSet.interview = :interview
    """)
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    void deleteAllByInterview(Interview interview);
}
