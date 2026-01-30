package com.shyashyashya.refit.domain.qnaset.model;

import com.shyashyashya.refit.domain.common.model.BaseEntity;
import com.shyashyashya.refit.domain.interview.model.Interview;
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
@Table(name = "qna_sets")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QnaSet extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "qna_set_id")
    private Long id;

    @Column(name = "question_text", nullable = false, columnDefinition = "varchar(200)")
    private String questionText;

    @Column(name = "answer_text", nullable = false, columnDefinition = "text")
    private String answerText;

    @Column(name = "is_marked_difficult", nullable = false)
    private boolean isMarkedDifficult;

    @JoinColumn(name = "interview_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Interview interview;

    @JoinColumn(name = "qna_set_category_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private QnaSetCategory qnaSetCategory;

    /*
     * Static Factory Method
     */
    public static QnaSet create(
            String questionText,
            String answerText,
            boolean isMarkedDifficult,
            Interview interview,
            QnaSetCategory qnaSetCategory) {
        return QnaSet.builder()
                .questionText(questionText)
                .answerText(answerText)
                .isMarkedDifficult(isMarkedDifficult)
                .interview(interview)
                .qnaSetCategory(qnaSetCategory)
                .build();
    }

    @Builder(access = AccessLevel.PRIVATE)
    private QnaSet(
            String questionText,
            String answerText,
            boolean isMarkedDifficult,
            Interview interview,
            QnaSetCategory qnaSetCategory) {
        this.questionText = questionText;
        this.answerText = answerText;
        this.isMarkedDifficult = isMarkedDifficult;
        this.interview = interview;
        this.qnaSetCategory = qnaSetCategory;
    }
}
