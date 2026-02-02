package com.shyashyashya.refit.global.oauth2.dto;

import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
import com.shyashyashya.refit.global.oauth2.service.GoogleOAuth2Service.GoogleUserInfo;
import lombok.Builder;

@Builder
public record OAuthResultDto(TokenPairDto tokenPair, boolean isNeedSignup, String nickname, String profileImageUrl) {

    public static OAuthResultDto createUser(String accessToken, String refreshToken, User user) {
        return OAuthResultDto.builder()
                .tokenPair(new TokenPairDto(accessToken, refreshToken))
                .isNeedSignup(false)
                .nickname(user.getNickname())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }

    public static OAuthResultDto createGuest(String accessToken, String refreshToken, GoogleUserInfo userInfo) {
        return OAuthResultDto.builder()
                .tokenPair(new TokenPairDto(accessToken, refreshToken))
                .isNeedSignup(true)
                .nickname(userInfo.name())
                .profileImageUrl(userInfo.picture())
                .build();
    }
}
