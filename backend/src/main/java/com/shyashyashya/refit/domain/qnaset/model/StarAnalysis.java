package com.shyashyashya.refit.domain.qnaset.model;

import com.shyashyashya.refit.global.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "star_analysis")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StarAnalysis extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "star_analysis_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "s_inclusion_level", nullable = false)
    private StarInclusionLevel sInclusionLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "t_inclusion_level", nullable = false)
    private StarInclusionLevel tInclusionLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "a_inclusion_level", nullable = false)
    private StarInclusionLevel aInclusionLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "r_inclusion_level", nullable = false)
    private StarInclusionLevel rInclusionLevel;

    @Column(name = "overall_summary_text", nullable = false, columnDefinition = "varchar(500)")
    private String overallSummaryText;

    @JoinColumn(name = "qna_set_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private QnaSet qnaSet;

    /*
     * Static Factory Method
     */
    public static StarAnalysis create(
            StarInclusionLevel sInclusionLevel,
            StarInclusionLevel tInclusionLevel,
            StarInclusionLevel aInclusionLevel,
            StarInclusionLevel rInclusionLevel,
            String overallSummaryText,
            QnaSet qnaSet) {
        return StarAnalysis.builder()
                .sInclusionLevel(sInclusionLevel)
                .tInclusionLevel(tInclusionLevel)
                .aInclusionLevel(aInclusionLevel)
                .rInclusionLevel(rInclusionLevel)
                .overallSummaryText(overallSummaryText)
                .qnaSet(qnaSet)
                .build();
    }

    @Builder(access = AccessLevel.PRIVATE)
    private StarAnalysis(
            StarInclusionLevel sInclusionLevel,
            StarInclusionLevel tInclusionLevel,
            StarInclusionLevel aInclusionLevel,
            StarInclusionLevel rInclusionLevel,
            String overallSummaryText,
            QnaSet qnaSet) {
        this.sInclusionLevel = sInclusionLevel;
        this.tInclusionLevel = tInclusionLevel;
        this.aInclusionLevel = aInclusionLevel;
        this.rInclusionLevel = rInclusionLevel;
        this.overallSummaryText = overallSummaryText;
        this.qnaSet = qnaSet;
    }
}
