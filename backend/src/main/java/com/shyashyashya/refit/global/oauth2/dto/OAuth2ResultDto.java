package com.shyashyashya.refit.global.oauth2.dto;

import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
import com.shyashyashya.refit.global.model.ClientOriginType;
import lombok.Builder;

@Builder
public record OAuth2ResultDto(
        TokenPairDto tokenPair,
        ClientOriginType clientOriginType,
        boolean isNeedSignup,
        String nickname,
        String profileImageUrl) {

    public static OAuth2ResultDto of(
            TokenPairDto tokenPairDto,
            Long userId,
            String nickname,
            String profileImageUrl,
            ClientOriginType clientOriginType) {
        return OAuth2ResultDto.builder()
                .tokenPair(tokenPairDto)
                .clientOriginType(clientOriginType)
                .isNeedSignup(userId == null)
                .nickname(nickname)
                .profileImageUrl(profileImageUrl)
                .build();
    }
}
