package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.qnaset.model.PdfHighlighting;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

public interface PdfHighlightingRepository extends JpaRepository<PdfHighlighting, Long> {

    List<Long> findIdByQnaSet(QnaSet qnaSet);

    void deleteAllByQnaSet(QnaSet qnaSet);
}
