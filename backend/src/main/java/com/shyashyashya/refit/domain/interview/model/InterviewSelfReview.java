package com.shyashyashya.refit.domain.interview.model;

import com.shyashyashya.refit.global.model.BaseEntity;
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
@Table(name = "interview_self_reviews")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class InterviewSelfReview extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "interview_self_review_id")
    private Long id;

    @Column(name = "keep_text", nullable = false, columnDefinition = "text")
    private String keepText;

    @Column(name = "problem_text", nullable = false, columnDefinition = "text")
    private String problemText;

    @Column(name = "try_text", nullable = false, columnDefinition = "text")
    private String tryText;

    @JoinColumn(name = "interview_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Interview interview;

    /*
     * Static Factory Method
     */
    public static InterviewSelfReview create(String keepText, String problemText, String tryText, Interview interview) {
        return InterviewSelfReview.builder()
                .keepText(keepText == null ? "" : keepText)
                .problemText(problemText == null ? "" : problemText)
                .tryText(tryText == null ? "" : tryText)
                .interview(interview)
                .build();
    }

    public static InterviewSelfReview createEmpty(Interview interview) {
        return InterviewSelfReview.builder()
                .keepText("")
                .problemText("")
                .tryText("")
                .interview(interview)
                .build();
    }

    public void updateKeepText(String keepText) {
        if (keepText != null) {
            this.keepText = keepText;
        }
    }

    public void updateProblemText(String problemText) {
        if (problemText != null) {
            this.problemText = problemText;
        }
    }

    public void updateTryText(String tryText) {
        if (tryText != null) {
            this.tryText = tryText;
        }
    }

    @Builder(access = AccessLevel.PRIVATE)
    private InterviewSelfReview(String keepText, String problemText, String tryText, Interview interview) {
        this.keepText = keepText;
        this.problemText = problemText;
        this.tryText = tryText;
        this.interview = interview;
    }
}
