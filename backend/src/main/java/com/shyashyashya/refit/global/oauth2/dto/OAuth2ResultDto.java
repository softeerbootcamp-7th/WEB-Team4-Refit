package com.shyashyashya.refit.global.oauth2.dto;

import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
import com.shyashyashya.refit.global.oauth2.service.GoogleOAuth2Service.GoogleUserInfo;
import com.shyashyashya.refit.global.util.ClientOriginType;
import lombok.Builder;

@Builder
public record OAuth2ResultDto(
        TokenPairDto tokenPair,
        ClientOriginType clientOriginType,
        boolean isNeedSignup,
        String nickname,
        String profileImageUrl) {

    public static OAuth2ResultDto createUser(
            String accessToken, String refreshToken, User user, ClientOriginType clientOriginType) {
        return OAuth2ResultDto.builder()
                .tokenPair(TokenPairDto.of(accessToken, refreshToken))
                .clientOriginType(clientOriginType)
                .isNeedSignup(false)
                .nickname(user.getNickname())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }

    public static OAuth2ResultDto createGuest(
            String accessToken, String refreshToken, GoogleUserInfo userInfo, ClientOriginType clientOriginType) {
        return OAuth2ResultDto.builder()
                .tokenPair(TokenPairDto.of(accessToken, refreshToken))
                .clientOriginType(clientOriginType)
                .isNeedSignup(true)
                .nickname(userInfo.name())
                .profileImageUrl(userInfo.picture())
                .build();
    }
}
