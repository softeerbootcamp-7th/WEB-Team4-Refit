package com.shyashyashya.refit.global.auth.dto;

import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record TestPublishTokenResponse(boolean isNeedSignUp, TokenPairDto tokens) {

    public static TestPublishTokenResponse of(boolean isNeedSignUp, String accessToken, String refreshToken) {
        return TestPublishTokenResponse.builder()
                .isNeedSignUp(isNeedSignUp)
                .tokens(TokenPairDto.of(accessToken, refreshToken))
                .build();
    }
}
