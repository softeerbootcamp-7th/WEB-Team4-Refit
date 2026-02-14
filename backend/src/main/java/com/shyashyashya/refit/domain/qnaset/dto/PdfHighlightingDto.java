package com.shyashyashya.refit.domain.qnaset.dto;

import com.shyashyashya.refit.domain.qnaset.model.PdfHighlighting;
import com.shyashyashya.refit.domain.qnaset.model.PdfHighlightingRect;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record PdfHighlightingDto(
        @NotNull Long pdfHighlightingId,
        @NotNull String highlightingText,
        @NotNull List<PdfHighlightingRectDto> rects) {

    public static PdfHighlightingDto of(PdfHighlighting pdfHighlighting, List<PdfHighlightingRect> rects) {
        List<PdfHighlightingRectDto> pdfHighlightingRectDtos =
                rects.stream().map(PdfHighlightingRectDto::from).toList();

        return new PdfHighlightingDto(
                pdfHighlighting.getId(), pdfHighlighting.getHighlightingText(), pdfHighlightingRectDtos);
    }
}
