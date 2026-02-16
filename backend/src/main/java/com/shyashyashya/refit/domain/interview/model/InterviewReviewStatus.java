package com.shyashyashya.refit.domain.interview.model;

public enum InterviewReviewStatus {
    NOT_LOGGED, // 기록 전
    LOG_DRAFT, // 기록 중
    QNA_SET_DRAFT, // 질답 세트 검토 중
    SELF_REVIEW_DRAFT, // 회고 중
    DEBRIEF_COMPLETED // 회고 완료
}
