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
@Table(name = "pdf_highlightings")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PdfHighlighting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pdf_highlighting_id")
    private Long id;

    @Column(name = "highlighting_text", nullable = false, columnDefinition = "varchar(2000)")
    private String highlightingText;

    @JoinColumn(name = "qna_set_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private QnaSet qnaSet;

    /*
     * Static Factory Method
     */
    public static PdfHighlighting create(String highlightingText, QnaSet qnaSet) {
        return PdfHighlighting.builder()
                .highlightingText(highlightingText)
                .qnaSet(qnaSet)
                .build();
    }

    @Builder(access = AccessLevel.PRIVATE)
    private PdfHighlighting(String highlightingText, QnaSet qnaSet) {
        this.qnaSet = qnaSet;
        this.highlightingText = highlightingText;
    }
}
