package com.shyashyashya.refit.global.auth.service;

import com.shyashyashya.refit.global.auth.dto.OAuthResult;

public interface OAuthService {

    String getOAuthLoginUrl();

    OAuthResult handleOAuthCallback(String code);
}
