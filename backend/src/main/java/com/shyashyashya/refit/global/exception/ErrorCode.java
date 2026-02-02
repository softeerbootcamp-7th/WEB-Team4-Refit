package com.shyashyashya.refit.global.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    INTERVIEW_NOT_FOUND(NOT_FOUND, "인터뷰가 존재하지 않습니다."),
    INTERVIEW_NOT_ACCESSIBLE(FORBIDDEN, "인터뷰에 접근할 수 없습니다."),
    INTERVIEW_NOT_IN_DRAFT_STATUS(BAD_REQUEST, "임시저장 상태의 인터뷰만 조회할 수 있습니다."),

    INDUSTRY_NOT_FOUND(NOT_FOUND, "산업군이 존재하지 않습니다."),
    JOB_CATEGORY_NOT_FOUND(NOT_FOUND, "직군이 존재하지 않습니다."),
    USER_NOT_FOUND(NOT_FOUND, "사용자가 존재하지 않습니다."),

    USER_SIGNUP_EMAIL_CONFLICT(CONFLICT, "이미 사용 중인 이메일입니다."),
    USER_SIGNUP_REQUIRED(UNAUTHORIZED, "회원가입이 필요합니다."),

    TOKEN_EXPIRED(UNAUTHORIZED, "토큰이 만료되었습니다."),
    LOGIN_REQUIRED(UNAUTHORIZED, "로그인이 필요합니다.");

    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}
