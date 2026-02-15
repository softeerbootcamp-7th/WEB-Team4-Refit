package com.shyashyashya.refit.global.auth.dto.response;

import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record TestPublishTokenResponse(
        @NotNull boolean isNeedSignUp, @NotNull TokenPairDto tokens) {

    public static TestPublishTokenResponse of(boolean isNeedSignUp, TokenPairDto tokenPair) {
        return TestPublishTokenResponse.builder()
                .isNeedSignUp(isNeedSignUp)
                .tokens(tokenPair)
                .build();
    }
}
