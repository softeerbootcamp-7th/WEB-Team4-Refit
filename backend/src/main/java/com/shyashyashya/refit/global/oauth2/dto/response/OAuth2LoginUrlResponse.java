package com.shyashyashya.refit.global.oauth2.dto.response;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record OAuth2LoginUrlResponse(@NotNull String oAuth2LoginUrl) {

    public static OAuth2LoginUrlResponse from(String oAuth2LoginUrl) {
        return OAuth2LoginUrlResponse.builder().oAuth2LoginUrl(oAuth2LoginUrl).build();
    }
}
