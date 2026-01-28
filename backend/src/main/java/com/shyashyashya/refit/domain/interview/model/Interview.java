package com.shyashyashya.refit.domain.interview.model;

import com.shyashyashya.refit.domain.common.model.BaseEntity;
import com.shyashyashya.refit.domain.company.model.Company;
import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.user.model.User;
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
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "interviews")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Interview extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "interview_id")
    private Long id;

    @Column(columnDefinition = "varchar(50)")
    private String jobRole;

    @Column(name = "interview_review_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private InterviewReviewStatus reviewStatus;

    @Column(name = "interview_result_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private InterviewResultStatus resultStatus;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private InterviewType interviewType;

    @Column(name = "interview_start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "interview_raw_text", columnDefinition = "text")
    private String rawText;

    @Column(columnDefinition = "varchar(2048)")
    private String pdfUrl;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @JoinColumn(name = "company_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Company company;

    @JoinColumn(name = "industry_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Industry industry;

    @JoinColumn(name = "job_category_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private JobCategory jobCategory;

    /*
     * Static Factory Method
     */
    public static Interview create(
            String jobRole,
            InterviewReviewStatus reviewStatus,
            InterviewResultStatus resultStatus,
            InterviewType interviewType,
            LocalDateTime startAt,
            String rawText,
            String pdfUrl,
            User user,
            Company company,
            Industry industry,
            JobCategory jobCategory) {
        return Interview.builder()
                .jobRole(jobRole)
                .reviewStatus(reviewStatus)
                .resultStatus(resultStatus)
                .interviewType(interviewType)
                .startAt(startAt)
                .rawText(rawText)
                .pdfUrl(pdfUrl)
                .user(user)
                .company(company)
                .industry(industry)
                .jobCategory(jobCategory)
                .build();
    }

    @Builder(access = AccessLevel.PRIVATE)
    private Interview(
            String jobRole,
            InterviewReviewStatus reviewStatus,
            InterviewResultStatus resultStatus,
            InterviewType interviewType,
            LocalDateTime startAt,
            String rawText,
            String pdfUrl,
            User user,
            Company company,
            Industry industry,
            JobCategory jobCategory) {
        this.jobRole = jobRole;
        this.reviewStatus = reviewStatus;
        this.resultStatus = resultStatus;
        this.interviewType = interviewType;
        this.startAt = startAt;
        this.rawText = rawText;
        this.pdfUrl = pdfUrl;
        this.user = user;
        this.company = company;
        this.industry = industry;
        this.jobCategory = jobCategory;
    }
}
