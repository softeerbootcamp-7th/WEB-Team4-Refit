package com.shyashyashya.refit.domain.qnaset.model;

import com.shyashyashya.refit.domain.common.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "pdf_highlighting_rects")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PdfHighlightingRect extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pdf_highlighting_rect_id")
    private Long id;

    @Column(nullable = false)
    private double x;

    @Column(nullable = false)
    private double y;

    @Column(nullable = false)
    private double width;

    @Column(nullable = false)
    private double height;

    @Column(nullable = false)
    private int pageNum;

    @JoinColumn(name = "pdf_highlighting_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private PdfHighlighting pdfHighlighting;

    /*
     * Static Factory Method
     */
    public static PdfHighlightingRect create(
            double x, double y, double width, double height, int pageNum, PdfHighlighting pdfHighlighting) {
        return PdfHighlightingRect.builder()
                .x(x)
                .y(y)
                .width(width)
                .height(height)
                .pageNum(pageNum)
                .pdfHighlighting(pdfHighlighting)
                .build();
    }

    @Builder(access = AccessLevel.PRIVATE)
    private PdfHighlightingRect(
            double x, double y, double width, double height, int pageNum, PdfHighlighting pdfHighlighting) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.pageNum = pageNum;
        this.pdfHighlighting = pdfHighlighting;
    }
}
