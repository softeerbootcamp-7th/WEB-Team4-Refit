package com.shyashyashya.refit.domain.interview.repository;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StarAnalysisRepository extends JpaRepository<StarAnalysis, Long> {
    Optional<StarAnalysis> findByQnaSet(QnaSet qnaSet);

    @Query("select s from StarAnalysis s where s.qnaSet.id in :qnaSetIds")
    List<StarAnalysis> findAllByQnaSetIdIn(@Param("qnaSetIds") List<Long> qnaSetIds);
}
