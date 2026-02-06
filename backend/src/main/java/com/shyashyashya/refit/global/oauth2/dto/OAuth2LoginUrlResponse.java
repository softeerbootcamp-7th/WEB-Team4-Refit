package com.shyashyashya.refit.global.oauth2.dto;

import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record OAuth2LoginUrlResponse(String oAuthLoginUrl) {

    public static OAuth2LoginUrlResponse from(String oAuthLoginUrl) {
        return OAuth2LoginUrlResponse.builder().oAuthLoginUrl(oAuthLoginUrl).build();
    }
}
