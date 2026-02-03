package com.shyashyashya.refit.domain.qnaset.dto;

import com.shyashyashya.refit.domain.qnaset.model.PdfHighlighting;
import com.shyashyashya.refit.domain.qnaset.model.PdfHighlightingRect;
import java.util.List;

public record PdfHighlightingDto(Long pdfHighlightingId, String highlightingText, List<PdfHighlightingRectDto> rects) {
    public static PdfHighlightingDto of(PdfHighlighting pdfHighlighting, List<PdfHighlightingRect> rects) {
        return new PdfHighlightingDto();
    }
}
