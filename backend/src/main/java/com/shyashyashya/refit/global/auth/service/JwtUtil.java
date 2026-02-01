package com.shyashyashya.refit.global.auth.service;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

public interface JwtUtil {

    String createAccessToken(@NotNull String email, @Nullable Long userId);

    String createRefreshToken(@NotNull String email, @NotNull Long userId);

    String getEmail(String token);

    Long getUserId(String token);

    void validateToken(String token);
}
