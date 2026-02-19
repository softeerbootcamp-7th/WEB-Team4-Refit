package com.shyashyashya.refit.domain.interview.repository;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewSelfReview;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface InterviewSelfReviewRepository extends JpaRepository<InterviewSelfReview, Long> {
    Optional<InterviewSelfReview> findByInterview(Interview interview);

    // 삭제 쿼리를 즉시 적용하여 referential integrity 위반이 일어나지 않도록 하기 위함
    @Query("""
        DELETE
          FROM InterviewSelfReview i
         WHERE i.interview = :interview
    """)
    @Modifying(clearAutomatically = true)
    void deleteByInterview(Interview interview);
}
