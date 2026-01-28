package com.shyashyashya.refit.domain.common.model;

import lombok.Getter;

@Getter
public enum ResponseCode {
    OK("성공했습니다."),
    CREATED("생성에 성공했습니다."),
    NO_CONTENT("삭제에 성공했습니다.");

    private final String message;

    ResponseCode(String message) {
        this.message = message;
    }
}
