package com.shyashyashya.refit.domain.interview.repository;

import com.shyashyashya.refit.domain.interview.model.QnaSetSelfReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QnaSetSelfReviewRepository extends JpaRepository<QnaSetSelfReview, Long> {
    Optional<QnaSetSelfReview> findByQnaSetId(Long qnaSetId);
}
