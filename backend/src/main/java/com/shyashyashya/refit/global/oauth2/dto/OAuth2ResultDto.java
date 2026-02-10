package com.shyashyashya.refit.global.oauth2.dto;

import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
import com.shyashyashya.refit.global.oauth2.service.GoogleOAuth2Service.GoogleUserInfo;
import lombok.Builder;

@Builder
public record OAuth2ResultDto(
        TokenPairDto tokenPair,
        String frontRedirectUri,
        boolean isNeedSignup,
        String nickname,
        String profileImageUrl) {

    public static OAuth2ResultDto createUser(
            String accessToken, String refreshToken, User user, String frontRedirectUri) {
        return OAuth2ResultDto.builder()
                .tokenPair(TokenPairDto.of(accessToken, refreshToken))
                .frontRedirectUri(frontRedirectUri)
                .isNeedSignup(false)
                .nickname(user.getNickname())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }

    public static OAuth2ResultDto createGuest(
            String accessToken, String refreshToken, GoogleUserInfo userInfo, String frontRedirectUri) {
        return OAuth2ResultDto.builder()
                .tokenPair(TokenPairDto.of(accessToken, refreshToken))
                .frontRedirectUri(frontRedirectUri)
                .isNeedSignup(true)
                .nickname(userInfo.name())
                .profileImageUrl(userInfo.picture())
                .build();
    }
}
