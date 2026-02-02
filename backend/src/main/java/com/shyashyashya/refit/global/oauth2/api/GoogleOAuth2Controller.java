package com.shyashyashya.refit.global.oauth2.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.global.auth.service.CookieUtil;
import com.shyashyashya.refit.global.oauth2.dto.OAuthLoginUrlResponse;
import com.shyashyashya.refit.global.oauth2.service.GoogleOAuth2Service;
import com.shyashyashya.refit.global.property.OAuth2Property;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/auth/login/google")
@RequiredArgsConstructor
public class GoogleOAuth2Controller {

    private final GoogleOAuth2Service googleOAuthService;
    private final OAuth2Property oAuth2Property;
    private final CookieUtil cookieUtil;

    @GetMapping
    public ResponseEntity<CommonResponse<OAuthLoginUrlResponse>> getOAuth2LoginUrl() {
        var body = CommonResponse.success(COMMON200, new OAuthLoginUrlResponse(googleOAuthService.getOAuthLoginUrl()));
        return ResponseEntity.ok(body);
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> handleOAuth2Callback(@RequestParam String code) {
        var result = googleOAuthService.handleOAuthCallback(code);
        var accessTokenCookie =
                cookieUtil.createAccessTokenCookie(result.tokenPair().accessToken());
        var refreshTokenCookie =
                cookieUtil.createResponseTokenCookie(result.tokenPair().refreshToken());

        String redirectUrl = buildRedirectUrl(result.isNeedSignup(), result.nickname(), result.profileImageUrl());

        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie)
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie)
                .header(HttpHeaders.LOCATION, redirectUrl)
                .build();
    }

    private String buildRedirectUrl(boolean isNeedSignup, String nickname, String profileImageUrl) {
        // TODO: 로그인 성공시 바로 메인페이지로 리다이렉션 가능한지 고민해보기
        return UriComponentsBuilder.fromUriString(oAuth2Property.frontendRedirectUri())
                .queryParam("status", isNeedSignup ? "signUpRequired" : "loginSuccess")
                .queryParam("nickname", nickname)
                .queryParam("profileImageUrl", profileImageUrl)
                .encode()
                .build()
                .toUriString();
    }
}
