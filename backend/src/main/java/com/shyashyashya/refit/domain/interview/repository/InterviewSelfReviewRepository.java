package com.shyashyashya.refit.domain.interview.repository;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewSelfReview;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewSelfReviewRepository extends JpaRepository<InterviewSelfReview, Long> {
    Optional<InterviewSelfReview> findByInterview(Interview interview);
}
