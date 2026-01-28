package com.shyashyashya.refit.domain.user.model;

import com.shyashyashya.refit.domain.common.model.BaseEntity;
import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
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
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", updatable = false, nullable = false)
    private Long id;

    @Column(columnDefinition = "varchar(255)")
    private String email;

    @Column(columnDefinition = "varchar(30)", nullable = false, unique = true)
    private String nickname;

    @Column(columnDefinition = "varchar(2048)")
    private String profileImageUrl;

    @Column(nullable = false)
    private boolean isAgreedToTerms = false;

    @JoinColumn(name = "industry_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Industry industry;

    @JoinColumn(name = "job_category_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private JobCategory jobCategory;

    /*
     Factory Method
    */
    public static User create(
            String email,
            String nickname,
            String profileImageUrl,
            boolean isAgreedToTerms,
            Industry industry,
            JobCategory jobCategory) {
        return User.builder()
                .email(email)
                .nickname(nickname)
                .profileImageUrl(profileImageUrl)
                .isAgreedToTerms(isAgreedToTerms)
                .industry(industry)
                .jobCategory(jobCategory)
                .build();
    }

    @Builder(access = AccessLevel.PRIVATE)
    private User(
            String email,
            String nickname,
            String profileImageUrl,
            boolean isAgreedToTerms,
            Industry industry,
            JobCategory jobCategory) {
        this.email = email;
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
        this.isAgreedToTerms = isAgreedToTerms;
        this.industry = industry;
        this.jobCategory = jobCategory;
    }
}
