package com.shyashyashya.refit.global.oauth2.service;

import com.shyashyashya.refit.global.constant.EnvironmentType;
import com.shyashyashya.refit.global.oauth2.dto.OAuthLoginUrlResponse;
import com.shyashyashya.refit.global.oauth2.dto.OAuth2ResultDto;

public interface OAuth2Service {

    OAuthLoginUrlResponse buildOAuth2LoginUrl(EnvironmentType environmentType);

    OAuth2ResultDto handleOAuth2Callback(String code, String state);
}
