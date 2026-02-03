package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.qnaset.model.PdfHighlighting;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PdfHighlightingRepository extends JpaRepository<PdfHighlighting, Long> {
    List<PdfHighlighting> findAllByQnaSet(QnaSet qnaSet);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        DELETE
        FROM PdfHighlighting p
        WHERE p.qnaSet = :qnaSet
    """)
    void deleteAllByQnaSet(@Param("qnaSet") QnaSet qnaSet);
}
