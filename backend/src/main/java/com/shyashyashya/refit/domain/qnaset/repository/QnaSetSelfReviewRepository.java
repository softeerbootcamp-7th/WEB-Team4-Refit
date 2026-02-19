package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetSelfReview;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QnaSetSelfReviewRepository extends JpaRepository<QnaSetSelfReview, Long> {
    Optional<QnaSetSelfReview> findByQnaSet(QnaSet qnaSet);

    @Query("select r from QnaSetSelfReview r where r.qnaSet.id in :qnaSetIds")
    List<QnaSetSelfReview> findAllByQnaSetIdIn(@Param("qnaSetIds") List<Long> qnaSetIds);

    @Query("""
        DELETE
          FROM QnaSetSelfReview r
         WHERE r.qnaSet.interview = :interview
    """)
    @Modifying(clearAutomatically = true)
    void deleteAllByInterview(Interview interview);
}
