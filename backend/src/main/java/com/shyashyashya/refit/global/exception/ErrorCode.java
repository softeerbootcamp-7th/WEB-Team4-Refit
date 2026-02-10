package com.shyashyashya.refit.global.exception;

import static org.springframework.http.HttpStatus.BAD_GATEWAY;
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
    INTERVIEW_REVIEW_STATUS_NOT_UPDATABLE_TO_LOG_DRAFT(BAD_REQUEST, "인터뷰 상태가 기록전 상태일 때만 기록중으로 바뀔 수 있습니다"),
    INTERVIEW_REVIEW_STATUS_NOT_UPDATABLE_TO_SELF_REVIEW_DRAFT(BAD_REQUEST, "인터뷰 상태가 기록중 상태일 때만 회고중으로 바뀔 수 있습니다"),
    INTERVIEW_REVIEW_STATUS_NOT_UPDATABLE_TO_DEBRIEF_COMPLETED(BAD_REQUEST, "인터뷰 상태가 회고중 상태일 때만 회고완료로 바뀔 수 있습니다"),

    QNA_SET_CATEGORY_NOT_FOUND(NOT_FOUND, "질문 카테고리가 존재하지 않습니다."),

    QNA_SET_NOT_FOUND(NOT_FOUND, "질문 세트가 존재하지 않습니다."),
    INDUSTRY_NOT_FOUND(NOT_FOUND, "산업군이 존재하지 않습니다."),
    JOB_CATEGORY_NOT_FOUND(NOT_FOUND, "직군이 존재하지 않습니다."),
    USER_NOT_FOUND(NOT_FOUND, "사용자가 존재하지 않습니다."),

    USER_SIGNUP_EMAIL_CONFLICT(CONFLICT, "이미 사용 중인 이메일입니다."),
    USER_SIGNUP_REQUIRED(UNAUTHORIZED, "회원가입이 필요합니다."),

    REQUEST_HOST_OAUTH2_REDIRECTION_NOT_ALLOWED(FORBIDDEN, "요청한 호스트는 OAuth2 리다이렉션이 허용되지 않습니다."),
    TOKEN_REQUIRED(UNAUTHORIZED, "토큰이 필요합니다."),
    TOKEN_EXPIRED(UNAUTHORIZED, "토큰이 만료되었습니다."),
    TOKEN_VALIDATION_FAILED(BAD_REQUEST, "토큰 검증에 실패했습니다."),
    INVALID_OAUTH2_CODE(BAD_REQUEST, "유효하지 않은 OAuth2 코드입니다."),
    EXTERNAL_OAUTH2_SERVER_ERROR(BAD_GATEWAY, "외부 OAuth2 서버와의 통신에 실패했습니다."),
    INVALID_OAUTH2_ACCESS_TOKEN(UNAUTHORIZED, "유효하지 않은 OAuth2 액세스 토큰입니다."),
    LOGIN_REQUIRED(UNAUTHORIZED, "로그인이 필요합니다."),

    SCRAP_FOLDER_NOT_ACCESSIBLE(FORBIDDEN, "스크랩 폴더에 접근할 수 없습니다."),
    SCRAP_FOLDER_NOT_FOUND(NOT_FOUND, "스크랩 폴더가 존재하지 않습니다."),
    SCRAP_FOLDER_NAME_DUPLICATED(CONFLICT, "이미 존재하는 스크랩 폴더 이름입니다.");

    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}
