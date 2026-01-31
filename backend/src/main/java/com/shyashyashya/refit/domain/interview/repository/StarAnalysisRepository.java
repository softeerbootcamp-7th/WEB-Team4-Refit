package com.shyashyashya.refit.domain.interview.repository;

import com.shyashyashya.refit.domain.interview.model.StarAnalysis;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StarAnalysisRepository extends JpaRepository<StarAnalysis, Long> {
    Optional<StarAnalysis> findByQnaSetId(Long qnaSetId);
}
