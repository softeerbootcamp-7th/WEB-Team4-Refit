package com.shyashyashya.refit.domain.interview.dto.request;

public enum InterviewDraftType {
    LOGGING, // 기록중인 임시저장 데이터 - review status => [LOG_DRAFT, QNA_SET_DRAFT]
    REVIEWING, // 회고중인 임시저장 데이터 - review status => [SELF_REVIEW_DRAFT]
}
