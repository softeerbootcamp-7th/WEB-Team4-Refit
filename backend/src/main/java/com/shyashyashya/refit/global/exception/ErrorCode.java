package com.shyashyashya.refit.global.exception;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.CONFLICT;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    INTERVIEW_NOT_FOUND(NOT_FOUND, "인터뷰가 존재하지 않습니다."),
    INTERVIEW_NOT_ACCESSIBLE(FORBIDDEN, "인터뷰에 접근할 수 없습니다."),

    INDUSTRY_NOT_FOUND(NOT_FOUND, "존재하지 않는 산업군입니다."),
    JOB_CATEGORY_NOT_FOUND(NOT_FOUND, "존재하지 않는 직업군입니다."),

    USER_SIGNUP_EMAIL_CONFLICT(CONFLICT, "이미 사용 중인 이메일입니다.");

    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}
