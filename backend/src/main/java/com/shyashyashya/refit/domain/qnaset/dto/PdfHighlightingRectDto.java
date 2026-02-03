package com.shyashyashya.refit.domain.qnaset.dto;

public record PdfHighlightingRectDto(
        Long pdfHighlightingRectId,
        Long pdfHighlightingId,
        Double x,
        Double y,
        Double width,
        Double height,
        Integer pageNum) {}
