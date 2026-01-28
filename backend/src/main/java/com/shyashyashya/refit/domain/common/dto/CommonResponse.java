package com.shyashyashya.refit.domain.common.dto;

import com.shyashyashya.refit.domain.common.model.ResponseCode;
import com.shyashyashya.refit.global.exception.ErrorCode;

public record CommonResponse<T>(boolean isSuccess, String code, String message, T result) {

    public static CommonResponse<Void> success(ResponseCode responseCode) {
        return new CommonResponse<>(true, responseCode.name(), responseCode.getMessage(), null);
    }

    public static <T> CommonResponse<T> success(ResponseCode responseCode, T result) {
        return new CommonResponse<>(true, responseCode.name(), responseCode.getMessage(), result);
    }

    public static CommonResponse<Void> customException(ErrorCode errorCode) {
        return new CommonResponse<>(false, errorCode.name(), errorCode.getMessage(), null);
    }

    public static CommonResponse<Void> unknownException(Exception e) {
        return new CommonResponse<>(false, e.getClass().getName(), e.getMessage(), null);
    }
}
