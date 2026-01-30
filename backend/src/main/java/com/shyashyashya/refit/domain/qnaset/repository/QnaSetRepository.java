package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.user.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QnaSetRepository extends JpaRepository<QnaSet, Long> {

    // TODO : queryDSL 적용
    @Query("""
        SELECT q
          FROM QnaSet q
         WHERE q.interview.user = :user
    """)
    List<QnaSet> findAllByUser(User user);
}
