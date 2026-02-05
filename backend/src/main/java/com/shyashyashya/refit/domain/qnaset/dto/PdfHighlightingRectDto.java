package com.shyashyashya.refit.domain.qnaset.dto;

import com.shyashyashya.refit.domain.qnaset.model.PdfHighlightingRect;

public record PdfHighlightingRectDto(Double x, Double y, Double width, Double height, Integer pageNumber) {

    public static PdfHighlightingRectDto from(PdfHighlightingRect pdfHighlightingRect) {
        return new PdfHighlightingRectDto(
                pdfHighlightingRect.getX(),
                pdfHighlightingRect.getY(),
                pdfHighlightingRect.getWidth(),
                pdfHighlightingRect.getHeight(),
                pdfHighlightingRect.getPageNumber());
    }
}
