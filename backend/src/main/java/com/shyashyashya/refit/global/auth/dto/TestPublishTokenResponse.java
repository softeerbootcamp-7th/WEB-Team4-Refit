package com.shyashyashya.refit.global.auth.dto;

import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record TestPublishTokenResponse(boolean isNeedSignUp, TokenPairDto tokens) {

    public static TestPublishTokenResponse of(boolean isNeedSignUp, TokenPairDto tokenPair) {
        return TestPublishTokenResponse.builder()
                .isNeedSignUp(isNeedSignUp)
                .tokens(tokenPair)
                .build();
    }
}
