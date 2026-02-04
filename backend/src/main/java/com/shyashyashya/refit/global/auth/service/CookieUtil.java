package com.shyashyashya.refit.global.auth.service;

import com.shyashyashya.refit.global.constant.AuthConstant;
import com.shyashyashya.refit.global.property.AuthJwtProperty;
import com.shyashyashya.refit.global.property.AuthProperty;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CookieUtil {

    private final AuthProperty authProperty;
    private final AuthJwtProperty authJwtProperty;

    public ResponseCookie createCookie(String name, String value, Duration maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(authProperty.usingHttps())
                .path("/")
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
    }

    public String createAccessTokenCookie(String accessToken) {
        return createCookie(
                        AuthConstant.ACCESS_TOKEN,
                        accessToken,
                        authJwtProperty.tokenExpiration().accessToken())
                .toString();
    }

    public String createResponseTokenCookie(String refreshToken) {
        return createCookie(
                        AuthConstant.REFRESH_TOKEN,
                        refreshToken,
                        authJwtProperty.tokenExpiration().refreshToken())
                .toString();
    }

    public String deleteCookie(String name) {
        return ResponseCookie.from(name, "").maxAge(0).path("/").build().toString();
    }
}
