package com.shyashyashya.refit.domain.common.dto;

import com.shyashyashya.refit.domain.common.model.ResponseCode;

public record CommonResponse<T>(
        boolean isSuccess,
        ResponseCode code,
        String message,
        T result) {

    public static <T> CommonResponse<T> success(ResponseCode responseCode, T result) {
        return new CommonResponse<>(true, responseCode, "성공입니다.", result);
    }
}
