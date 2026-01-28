package com.shyashyashya.refit.global.exception;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<CommonResponse<Void>> handleCustomException(CustomException e) {
        ErrorCode errorCode = e.getErrorCode();
        var response = CommonResponse.customException(errorCode);
        return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponse<Void>> ExceptionHandler(Exception e) {
        var response = CommonResponse.unknownException(e);
        return ResponseEntity.internalServerError().body(response);
    }
}
