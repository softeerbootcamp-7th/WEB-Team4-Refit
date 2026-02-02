package com.shyashyashya.refit.domain.interview.repository;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QnaSetRepository extends JpaRepository<QnaSet, Long> {
    List<QnaSet> findAllByInterview(Interview interview);
}
