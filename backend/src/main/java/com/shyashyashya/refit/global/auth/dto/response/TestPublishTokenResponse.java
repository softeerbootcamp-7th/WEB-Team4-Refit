package com.shyashyashya.refit.global.auth.dto.response;

import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
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
