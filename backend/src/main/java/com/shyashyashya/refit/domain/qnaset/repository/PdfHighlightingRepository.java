package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.qnaset.model.PdfHighlighting;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface PdfHighlightingRepository extends JpaRepository<PdfHighlighting, Long> {
    List<PdfHighlighting> findAllByQnaSet(QnaSet qnaSet);

    List<Long> findIdByQnaSet(QnaSet qnaSet);

    List<PdfHighlighting> findAllByQnaSetIn(List<QnaSet> qnaSets);

    void deleteAllByQnaSet(QnaSet qnaSet);

    boolean existsByQnaSet(QnaSet qnaSet);

    @Query("""
        DELETE
          FROM PdfHighlighting p
         WHERE p.qnaSet.interview = :interview
    """)
    @Modifying(clearAutomatically = true)
    void deleteAllByInterview(Interview interview);
}
