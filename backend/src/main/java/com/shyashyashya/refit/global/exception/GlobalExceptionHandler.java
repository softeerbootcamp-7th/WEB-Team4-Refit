package com.shyashyashya.refit.global.exception;

import static com.shyashyashya.refit.global.exception.ErrorCode.LOGIN_REQUIRED;

import com.shyashyashya.refit.global.dto.ApiResponse;
import com.shyashyashya.refit.global.auth.service.CookieUtil;
import com.shyashyashya.refit.global.constant.AuthConstant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    private final CookieUtil cookieUtil;

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException e) {
        ErrorCode errorCode = e.getErrorCode();
        log.info("CustomException [{}]: {}", errorCode.name(), errorCode.getMessage());
        var response = ApiResponse.customException(errorCode);
        return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
    }

    @ExceptionHandler(RefreshTokenTheftException.class)
    private ResponseEntity<ApiResponse<Void>> handleRefreshTokenTheftException(RefreshTokenTheftException e) {
        String deleteAccessTokenCookie = cookieUtil.deleteCookie(AuthConstant.ACCESS_TOKEN);
        String deleteRefreshTokenCookie = cookieUtil.deleteCookie(AuthConstant.REFRESH_TOKEN);
        log.info("RefreshTokenTheftException occurred");
        var response = ApiResponse.customException(LOGIN_REQUIRED);
        return ResponseEntity.status(LOGIN_REQUIRED.getHttpStatus())
                .header(HttpHeaders.SET_COOKIE, deleteAccessTokenCookie)
                .header(HttpHeaders.SET_COOKIE, deleteRefreshTokenCookie)
                .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handlerException(Exception e) {
        log.error("Exception: {}", e.getMessage());
        var response = ApiResponse.unknownException(e);
        return ResponseEntity.internalServerError().body(response);
    }
}
