package com.shyashyashya.refit.global.oauth2.api;

import com.shyashyashya.refit.global.dto.ApiResponse;
import com.shyashyashya.refit.global.oauth2.dto.OAuth2LoginUrlResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

public interface OAuth2Controller {

    ResponseEntity<ApiResponse<OAuth2LoginUrlResponse>> buildOAuth2LoginUrl(HttpServletRequest request);

    ResponseEntity<Void> handleOAuth2Callback(@RequestParam String code, @RequestParam String state);
}
