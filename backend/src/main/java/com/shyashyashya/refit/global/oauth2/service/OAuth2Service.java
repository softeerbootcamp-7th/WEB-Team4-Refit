package com.shyashyashya.refit.global.oauth2.service;

import com.shyashyashya.refit.global.oauth2.dto.OAuthResultDto;

public interface OAuth2Service {

    String getOAuthLoginUrl();

    OAuthResultDto handleOAuthCallback(String code);
}
