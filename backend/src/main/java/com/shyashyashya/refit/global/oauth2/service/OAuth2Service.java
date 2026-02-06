package com.shyashyashya.refit.global.oauth2.service;

import com.shyashyashya.refit.global.constant.EnvironmentType;
import com.shyashyashya.refit.global.oauth2.dto.OAuthLoginUrlResponse;
import com.shyashyashya.refit.global.oauth2.dto.OAuthResultDto;

public interface OAuth2Service {

    OAuthLoginUrlResponse buildOAuth2LoginUrl(EnvironmentType environmentType);

    OAuthResultDto handleOAuthCallback(String code, String state);
}
