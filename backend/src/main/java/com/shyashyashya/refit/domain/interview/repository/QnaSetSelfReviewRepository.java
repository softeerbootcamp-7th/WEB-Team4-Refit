package com.shyashyashya.refit.domain.interview.repository;

import java.util.Optional;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetSelfReview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QnaSetSelfReviewRepository extends JpaRepository<QnaSetSelfReview, Long> {
    Optional<QnaSetSelfReview> findByQnaSet(QnaSet qnaSet);
}
