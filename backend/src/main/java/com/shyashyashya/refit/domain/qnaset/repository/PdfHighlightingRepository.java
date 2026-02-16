package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.qnaset.model.PdfHighlighting;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PdfHighlightingRepository extends JpaRepository<PdfHighlighting, Long> {
    List<PdfHighlighting> findAllByQnaSet(QnaSet qnaSet);

    void deleteAllByQnaSet(QnaSet qnaSet);
}
