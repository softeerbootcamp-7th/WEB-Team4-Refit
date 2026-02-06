package com.shyashyashya.refit.global.oauth2.dto;

import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record OAuthLoginUrlResponse(String oAuthLoginUrl) {

    public static OAuthLoginUrlResponse from(String oAuthLoginUrl) {
        return OAuthLoginUrlResponse.builder().oAuthLoginUrl(oAuthLoginUrl).build();
    }
}
