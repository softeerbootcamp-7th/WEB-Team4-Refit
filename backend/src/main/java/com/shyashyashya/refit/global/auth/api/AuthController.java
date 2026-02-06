package com.shyashyashya.refit.global.auth.api;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.global.auth.service.AuthService;
import com.shyashyashya.refit.global.auth.service.CookieUtil;
import com.shyashyashya.refit.global.constant.AuthConstant;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.shyashyashya.refit.global.dto.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth Controller", description = "인증 관련 API 입니다.")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CookieUtil cookieUtil;

    @Operation(summary = "리프레시 토큰과 엑세스 토큰을 재발급합니다.", description = "리프레시 토큰이 재발급되면, 기존 리프레시 토큰은 폐기됩니다.")
    @GetMapping("/reissue")
    public ResponseEntity<CommonResponse<Void>> reissue(
            @CookieValue(value = AuthConstant.ACCESS_TOKEN) String accessToken,
            @CookieValue(value = AuthConstant.REFRESH_TOKEN) String refreshToken) {

        var response = CommonResponse.success(COMMON200);
        return authService
                .reissue(accessToken, refreshToken)
                .map(tokenPair -> {
                    String accessTokenCookie = cookieUtil.createAccessTokenCookie(tokenPair.accessToken());
                    String refreshTokenCookie = cookieUtil.createResponseTokenCookie(tokenPair.refreshToken());

                    return ResponseEntity.ok()
                            .header(HttpHeaders.SET_COOKIE, accessTokenCookie)
                            .header(HttpHeaders.SET_COOKIE, refreshTokenCookie)
                            .body(response);
                })
                .orElse(ResponseEntity.ok(response));
    }
}
