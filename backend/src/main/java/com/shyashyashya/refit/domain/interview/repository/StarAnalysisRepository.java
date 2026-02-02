package com.shyashyashya.refit.domain.interview.repository;

import java.util.Optional;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StarAnalysisRepository extends JpaRepository<StarAnalysis, Long> {
    Optional<StarAnalysis> findByQnaSet(QnaSet qnaSet);
}
