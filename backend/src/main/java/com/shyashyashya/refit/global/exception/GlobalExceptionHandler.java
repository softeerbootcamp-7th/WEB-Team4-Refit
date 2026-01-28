package com.shyashyashya.refit.global.exception;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<CommonResponse<Void>> handleCustomException(CustomException e) {
        ErrorCode errorCode = e.getErrorCode();
        log.info("CustomException: [{}]: {}", errorCode.name(), errorCode.getMessage());
        var response = CommonResponse.customException(errorCode);
        return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponse<Void>> handlerException(Exception e) {
        log.error("Exception: [{}]: {}", e.getClass().getName(), e.getMessage());
        var response = CommonResponse.unknownException(e);
        return ResponseEntity.internalServerError().body(response);
    }
}
