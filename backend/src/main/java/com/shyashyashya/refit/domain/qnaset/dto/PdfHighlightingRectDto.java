package com.shyashyashya.refit.domain.qnaset.dto;

import com.shyashyashya.refit.domain.qnaset.model.PdfHighlightingRect;
import jakarta.validation.constraints.NotNull;

public record PdfHighlightingRectDto(
        @NotNull Double x,
        @NotNull Double y,
        @NotNull Double width,
        @NotNull Double height,
        @NotNull Integer pageNumber) {

    public static PdfHighlightingRectDto from(PdfHighlightingRect pdfHighlightingRect) {
        return new PdfHighlightingRectDto(
                pdfHighlightingRect.getX(),
                pdfHighlightingRect.getY(),
                pdfHighlightingRect.getWidth(),
                pdfHighlightingRect.getHeight(),
                pdfHighlightingRect.getPageNumber());
    }
}
