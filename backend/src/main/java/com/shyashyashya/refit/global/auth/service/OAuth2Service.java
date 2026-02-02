package com.shyashyashya.refit.global.auth.service;

import com.shyashyashya.refit.global.auth.dto.OAuthResultDto;

public interface OAuth2Service {

    String getOAuthLoginUrl();

    OAuthResultDto handleOAuthCallback(String code);
}
