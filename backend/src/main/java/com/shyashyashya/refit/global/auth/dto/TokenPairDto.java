package com.shyashyashya.refit.global.auth.dto;

import jakarta.validation.constraints.NotNull;

public record TokenPairDto(
        @NotNull String accessToken, @NotNull String refreshToken) {

    public static TokenPairDto of(String accessToken, String refreshToken) {
        return new TokenPairDto(accessToken, refreshToken);
    }
}
