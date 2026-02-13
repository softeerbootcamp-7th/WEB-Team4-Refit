package com.shyashyashya.refit.global.auth.dto.response;

import com.shyashyashya.refit.global.auth.dto.TokenReissueResultDto;
import lombok.Builder;

@Builder(access = lombok.AccessLevel.PRIVATE)
public record TokenReissueResponse(boolean isReissueProcessed, boolean isNeedSignUp) {

    public static TokenReissueResponse from(TokenReissueResultDto tokenReissueResultDto) {
        return TokenReissueResponse.builder()
                .isReissueProcessed(tokenReissueResultDto.isReissueProcessed())
                .isNeedSignUp(tokenReissueResultDto.isNeedSignUp())
                .build();
    }
}
