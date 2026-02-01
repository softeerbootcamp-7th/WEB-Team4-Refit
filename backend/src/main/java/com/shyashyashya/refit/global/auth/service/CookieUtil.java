package com.shyashyashya.refit.global.auth.service;

import java.time.Duration;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    public ResponseCookie createCookie(String name, String value, Duration maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                //            .secure(true) // TODO: 추후 HTTPS 적용 시 활성화 (배포 환경에서만 적용되게 고민필요)
                .path("/")
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
    }

    public ResponseCookie deleteCookie(String name) {
        return ResponseCookie.from(name, "").maxAge(0).path("/").build();
    }
}
