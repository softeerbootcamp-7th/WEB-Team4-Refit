package com.shyashyashya.refit.domain.interview.repository;

import com.shyashyashya.refit.domain.interview.model.QnaSetSelfReview;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QnaSetSelfReviewRepository extends JpaRepository<QnaSetSelfReview, Long> {
    Optional<QnaSetSelfReview> findByQnaSetId(Long qnaSetId);
}
