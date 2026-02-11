package com.shyashyashya.refit.global.dto;

import com.shyashyashya.refit.global.exception.ErrorCode;
import com.shyashyashya.refit.global.model.ResponseCode;

public record ApiResponse<T>(boolean isSuccess, String code, String message, T result) {

    public static ApiResponse<Void> success(ResponseCode responseCode) {
        return new ApiResponse<>(true, responseCode.name(), responseCode.getMessage(), null);
    }

    public static <T> ApiResponse<T> success(ResponseCode responseCode, T result) {
        return new ApiResponse<>(true, responseCode.name(), responseCode.getMessage(), result);
    }

    public static ApiResponse<Void> customException(ErrorCode errorCode) {
        return new ApiResponse<>(false, errorCode.name(), errorCode.getMessage(), null);
    }

    public static ApiResponse<Void> exception(Exception e) {
        return new ApiResponse<>(false, e.getClass().getName(), e.getMessage(), null);
    }
}
