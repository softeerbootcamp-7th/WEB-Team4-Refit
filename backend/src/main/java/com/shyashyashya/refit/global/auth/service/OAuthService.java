package com.shyashyashya.refit.global.auth.service;

import com.shyashyashya.refit.global.auth.dto.OAuthResultDto;

public interface OAuthService {

    String getOAuthLoginUrl();

    OAuthResultDto handleOAuthCallback(String code);
}
