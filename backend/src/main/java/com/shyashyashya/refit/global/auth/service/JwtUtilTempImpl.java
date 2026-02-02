package com.shyashyashya.refit.global.auth.service;

import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;

// TODO: PR 머지 후 제거
@Component
public class JwtUtilTempImpl implements JwtUtil {

    @Override
    public String createAccessToken(String email, @Nullable Long userId) {
        return "this_is_access_token";
    }

    @Override
    public String createRefreshToken(String email, Long userId) {
        return "this_is_refresh_token";
    }

    @Override
    public String getEmail(String token) {
        return "myemail@test.com";
    }

    @Override
    public Long getUserId(String token) {
        return 1L;
    }

    @Override
    public void validateToken(String token) {}
}
