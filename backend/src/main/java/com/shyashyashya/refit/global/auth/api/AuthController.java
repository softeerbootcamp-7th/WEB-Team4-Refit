package com.shyashyashya.refit.global.auth.api;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.global.auth.dto.TokenReissueResponse;
import com.shyashyashya.refit.global.auth.dto.TokenReissueResultDto;
import com.shyashyashya.refit.global.auth.service.AuthService;
import com.shyashyashya.refit.global.auth.service.CookieUtil;
import com.shyashyashya.refit.global.constant.AuthConstant;
import com.shyashyashya.refit.global.dto.ApiResponse;
import com.shyashyashya.refit.global.util.ClientOriginType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    public ResponseEntity<ApiResponse<TokenReissueResponse>> reissue(
            @CookieValue(value = AuthConstant.ACCESS_TOKEN, required = false) String accessTokenFromHeader,
            @CookieValue(value = AuthConstant.REFRESH_TOKEN, required = false) String refreshTokenFromHeader,
            @RequestParam(required = false) String originType) {

        ClientOriginType clientOriginType = ClientOriginType.fromOriginString(origin);
        TokenReissueResultDto result = authService.reissue(accessTokenFromHeader, refreshTokenFromHeader);

        var response = ApiResponse.success(COMMON200, TokenReissueResponse.from(result));
        if (!result.isReissueProcessed()) {
            return ResponseEntity.ok(response);
        }

        // reissue가 처리된 경우에만 쿠키 재설정
        String accessTokenCookie =
                cookieUtil.createAccessTokenCookie(result.tokenPair().accessToken(), clientOriginType);
        String refreshTokenCookie =
                cookieUtil.createResponseTokenCookie(result.tokenPair().refreshToken(), clientOriginType);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie)
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie)
                .body(response);
    }
}
