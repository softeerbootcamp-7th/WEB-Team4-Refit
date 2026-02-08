package com.shyashyashya.refit.global.oauth2.service;

import com.shyashyashya.refit.global.oauth2.dto.OAuth2LoginUrlResponse;
import com.shyashyashya.refit.global.oauth2.dto.OAuth2ResultDto;

public interface OAuth2Service {

    OAuth2LoginUrlResponse buildOAuth2LoginUrl(String requestHostUrl);

    OAuth2ResultDto handleOAuth2Callback(String code, String state);
}
