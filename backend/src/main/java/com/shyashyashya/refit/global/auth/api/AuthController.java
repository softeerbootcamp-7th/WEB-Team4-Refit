package com.shyashyashya.refit.global.auth.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.global.auth.service.AuthService;
import com.shyashyashya.refit.global.auth.service.CookieUtil;
import com.shyashyashya.refit.global.constant.AuthConstant;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CookieUtil cookieUtil;

    @GetMapping("/reissue")
    public ResponseEntity<CommonResponse<Void>> reissue(
            @CookieValue(value = AuthConstant.ACCESS_TOKEN) String accessToken,
            @CookieValue(value = AuthConstant.REFRESH_TOKEN) String refreshToken) {

        return authService
                .reissue(accessToken, refreshToken)
                .map(tokenPair -> {
                    String accessTokenCookie = cookieUtil.createAccessTokenCookie(tokenPair.accessToken());
                    String refreshTokenCookie = cookieUtil.createResponseTokenCookie(tokenPair.refreshToken());

                    var body = CommonResponse.success(COMMON200);
                    return ResponseEntity.ok()
                            .header(HttpHeaders.SET_COOKIE, accessTokenCookie)
                            .header(HttpHeaders.SET_COOKIE, refreshTokenCookie)
                            .body(body);
                })
                .orElse(ResponseEntity.ok(CommonResponse.success(COMMON200)));
    }
}
