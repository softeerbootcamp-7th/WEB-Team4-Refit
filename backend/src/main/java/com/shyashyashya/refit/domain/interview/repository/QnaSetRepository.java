package com.shyashyashya.refit.domain.interview.repository;

import java.util.List;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QnaSetRepository extends JpaRepository<QnaSet, Long> {
    List<QnaSet> findAllByInterviewId(Long interviewId);
}
