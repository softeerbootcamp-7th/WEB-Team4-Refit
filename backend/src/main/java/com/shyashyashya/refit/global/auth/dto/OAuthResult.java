package com.shyashyashya.refit.global.auth.dto;

import java.util.Optional;
import lombok.Builder;

@Builder
public record OAuthResult(
        String accessToken,
        Optional<String> refreshToken,
        boolean isNeedSignup,
        String nickname,
        String profileImageUrl) {}
