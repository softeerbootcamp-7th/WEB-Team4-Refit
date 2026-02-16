package com.shyashyashya.refit.global.auth.dto.response;

import com.shyashyashya.refit.global.auth.dto.TokenReissueResultDto;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder(access = lombok.AccessLevel.PRIVATE)
public record TokenReissueResponse(
        @NotNull boolean isReissueProcessed, @NotNull boolean isNeedSignUp) {

    public static TokenReissueResponse from(TokenReissueResultDto tokenReissueResultDto) {
        return TokenReissueResponse.builder()
                .isReissueProcessed(tokenReissueResultDto.isReissueProcessed())
                .isNeedSignUp(tokenReissueResultDto.isNeedSignUp())
                .build();
    }
}
