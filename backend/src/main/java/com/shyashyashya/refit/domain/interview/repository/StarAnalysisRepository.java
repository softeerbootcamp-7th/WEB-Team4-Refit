package com.shyashyashya.refit.domain.interview.repository;

import com.shyashyashya.refit.domain.interview.model.StarAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StarAnalysisRepository extends JpaRepository<StarAnalysis, Long> {
    Optional<StarAnalysis> findByQnaSetId(Long qnaSetId);
}
