package com.shyashyashya.refit.global.exception;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // Example - 실제로 500 에러는 Exception 메세지를 가져올 예정
    UNKNOWN_ERROR(INTERNAL_SERVER_ERROR, "알 수 없는 에러가 발생했습니다.");

    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}
