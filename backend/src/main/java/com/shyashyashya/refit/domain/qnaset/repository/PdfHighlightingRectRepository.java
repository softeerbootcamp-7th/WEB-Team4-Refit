package com.shyashyashya.refit.domain.qnaset.repository;

import com.shyashyashya.refit.domain.qnaset.model.PdfHighlighting;
import com.shyashyashya.refit.domain.qnaset.model.PdfHighlightingRect;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PdfHighlightingRectRepository extends JpaRepository<PdfHighlightingRect, Long> {
    List<PdfHighlightingRect> findAllByPdfHighlighting(PdfHighlighting pdfHighlighting);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
       DELETE
       FROM PdfHighlightingRect r
       WHERE r.pdfHighlighting.id
       IN :highlightingIds
    """)
    void deleteAllByPdfHighlightingIds(@Param("highlightingIds") List<Long> highlightingIds);

    List<PdfHighlightingRect> findAllByPdfHighlightingIn(List<PdfHighlighting> pdfHighlightings);
}
