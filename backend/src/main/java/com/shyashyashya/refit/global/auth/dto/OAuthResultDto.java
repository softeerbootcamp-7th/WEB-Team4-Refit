package com.shyashyashya.refit.global.auth.dto;

import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.auth.service.GoogleOAuthService.GoogleUserInfo;
import lombok.Builder;

@Builder
public record OAuthResultDto(
        String accessToken, String refreshToken, boolean isNeedSignup, String nickname, String profileImageUrl) {

    public static OAuthResultDto createUser(String accessToken, String refreshToken, User user) {
        return OAuthResultDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .isNeedSignup(false)
                .nickname(user.getNickname())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }

    public static OAuthResultDto createGuest(String accessToken, String refreshToken, GoogleUserInfo userInfo) {
        return OAuthResultDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .isNeedSignup(true)
                .nickname(userInfo.name())
                .profileImageUrl(userInfo.picture())
                .build();
    }
}
