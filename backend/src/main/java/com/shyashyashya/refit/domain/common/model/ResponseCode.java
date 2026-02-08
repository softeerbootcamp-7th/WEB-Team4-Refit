package com.shyashyashya.refit.domain.common.model;

import lombok.Getter;

@Getter
public enum ResponseCode {
    COMMON200("성공했습니다."),
    COMMON201("생성에 성공했습니다."),
    COMMON204("삭제에 성공했습니다.");

    private final String message;

    ResponseCode(String message) {
        this.message = message;
    }
}
