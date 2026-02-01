package com.shyashyashya.refit.global.auth.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.global.auth.service.CookieUtil;
import com.shyashyashya.refit.global.auth.service.GoogleOAuthService;
import com.shyashyashya.refit.global.property.AuthProperty;
import java.time.Duration;
import java.util.Map;
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
public class GoogleOAuthController {

    public final GoogleOAuthService googleOAuthService;
    public final AuthProperty authProperty;
    public final CookieUtil cookieUtil;

    // TODO: PR 머지 후 제거
    private static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";
    private static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

    @GetMapping
    public ResponseEntity<CommonResponse<Map<String, String>>> OAuthLogin() {
        var body = CommonResponse.success(COMMON200, Map.of("OAuthLoginUrl", googleOAuthService.getOAuthLoginUrl()));
        return ResponseEntity.ok(body);
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> OAuthCallback(@RequestParam String code) {
        var result = googleOAuthService.handleOAuthCallback(code);
        var responseBuilder = ResponseEntity.status(HttpStatus.FOUND);

        // accessToken, refreshToken 쿠키 생성
        var accessCookie = cookieUtil.createCookie(
                ACCESS_TOKEN_COOKIE_NAME, result.accessToken(), Duration.ofHours(1) // TODO: PR 머지되면 대체하기
                // authProperty.jwt().tokenExpiration().accessToken()
                );
        responseBuilder.header(HttpHeaders.SET_COOKIE, accessCookie.toString());

        if (result.refreshToken().isPresent()) {
            var refreshCookie = cookieUtil.createCookie(
                    REFRESH_TOKEN_COOKIE_NAME, result.refreshToken().get(), Duration.ofDays(7) // TODO: PR 머지되면 대체하기
                    // authProperty.jwt().tokenExpiration().refreshToken()
                    );
            responseBuilder.header(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        }

        // 프론트엔드 리다이렉트 URL 생성
        // TODO: 로그인 성공시 바로 메인페이지로 리다이렉션 가능한지 고민해보기
        String redirectUrl = UriComponentsBuilder.fromUriString(authProperty.frontendOAuthRedirectUri())
                .queryParam("status", result.isNeedSignup() ? "signUpRequired" : "loginSuccess")
                .queryParam("nickname", result.nickname())
                .queryParam("profileImageUrl", result.profileImageUrl())
                .encode()
                .build()
                .toUriString();

        return responseBuilder.header(HttpHeaders.LOCATION, redirectUrl).build();
    }
}
