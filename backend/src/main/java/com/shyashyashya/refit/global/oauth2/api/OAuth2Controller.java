package com.shyashyashya.refit.global.oauth2.api;

import com.shyashyashya.refit.global.dto.CommonResponse;
import com.shyashyashya.refit.global.oauth2.dto.OAuthLoginUrlResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

public interface OAuth2Controller {

    ResponseEntity<CommonResponse<OAuthLoginUrlResponse>> getOAuth2LoginUrl();

    ResponseEntity<Void> handleOAuth2Callback(@RequestParam String code);
}
