package com.shyashyashya.refit.domain.interview.model;

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
@Table(name = "qna_set_self_reviews")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QnaSetSelfReview extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "qna_set_self_review_id")
    private Long id;

    @Column(name = "self_review_text", nullable = false, columnDefinition = "varchar(500)")
    private String selfReviewText;

    @JoinColumn(name = "qna_set_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private QnaSet qnaSet;

    /*
     * Static Factory Method
     */
    public static QnaSetSelfReview create(String selfReviewText, QnaSet qnaSet) {
        return QnaSetSelfReview.builder()
                .selfReviewText(selfReviewText)
                .qnaSet(qnaSet)
                .build();
    }

    @Builder(access = AccessLevel.PRIVATE)
    private QnaSetSelfReview(String selfReviewText, QnaSet qnaSet) {
        this.selfReviewText = selfReviewText;
        this.qnaSet = qnaSet;
    }
}
