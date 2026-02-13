package com.shyashyashya.refit.global.auth.dto;

import jakarta.annotation.Nullable;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record TokenReissueResultDto(boolean isReissueProcessed, boolean isNeedSignUp, TokenPairDto tokenPair) {

    public static TokenReissueResultDto createReissueProcessed(
            @Nullable Long userId, String accessToken, String refreshToken) {
        return TokenReissueResultDto.builder()
                .isReissueProcessed(true)
                .isNeedSignUp(userId == null)
                .tokenPair(TokenPairDto.of(accessToken, refreshToken))
                .build();
    }

    public static TokenReissueResultDto createReissueNotProcessed(
            @Nullable Long userId, String accessToken, String refreshToken) {
        return TokenReissueResultDto.builder()
                .isReissueProcessed(false)
                .isNeedSignUp(userId == null)
                .tokenPair(TokenPairDto.of(accessToken, refreshToken))
                .build();
    }
}
