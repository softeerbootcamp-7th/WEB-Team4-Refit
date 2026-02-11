package com.shyashyashya.refit.global.auth.api;

import static com.shyashyashya.refit.global.exception.ErrorCode.USER_NOT_FOUND;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.auth.dto.TestPublishTokenResponse;
import com.shyashyashya.refit.global.auth.model.RefreshToken;
import com.shyashyashya.refit.global.auth.repository.RefreshTokenRepository;
import com.shyashyashya.refit.global.auth.service.CookieUtil;
import com.shyashyashya.refit.global.auth.service.JwtUtil;
import com.shyashyashya.refit.global.constant.AuthConstant;
import com.shyashyashya.refit.global.constant.UrlConstant;
import com.shyashyashya.refit.global.dto.ApiResponse;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.ClientOriginType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Test Auth/User API", description = "개발용 테스트 인증/인가 API입니다.")
@RestController
@RequestMapping("/test/auth")
@RequiredArgsConstructor
public class TestAuthController {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final CookieUtil cookieUtil;
    private final JwtUtil jwtUtil;

    @Operation(
            summary = "(테스트용) Access&Refresh Token을 발급합니다.",
            description = "발급된 토큰은 origin에 따라 세팅됩니다. response body에 회원가입 필요 여부가 포함됩니다.")
    @GetMapping("/token")
    public ResponseEntity<ApiResponse<TestPublishTokenResponse>> publishToken(
            @RequestParam("email") @NotNull @Email String email, @RequestParam(required = false) String origin) {
        ClientOriginType clientOriginType = ClientOriginType.fromOriginString(origin);
        Long userId = userRepository.findByEmail(email).map(User::getId).orElse(null);
        return getTokenResponse(email, userId, clientOriginType);
    }

    @GetMapping("/token/{userId}")
    public ResponseEntity<ApiResponse<TestPublishTokenResponse>> publishTokenByUserId(
            @PathVariable @NotNull Long userId, @RequestParam(required = false) String origin) {
        ClientOriginType clientOriginType = ClientOriginType.fromOriginString(origin);
        User user = userRepository.findById(userId).orElseThrow(() -> new CustomException(USER_NOT_FOUND));
        return getTokenResponse(user.getEmail(), userId, clientOriginType);
    }

    @Operation(summary = "(테스트용) 쿠키에 설정된 토큰들을 삭제합니다.")
    @DeleteMapping("/cookies")
    public ResponseEntity<ApiResponse<Void>> deleteTokenCookies(
            @CookieValue(value = AuthConstant.REFRESH_TOKEN, required = false) String refreshToken,
            @RequestParam(required = false) String origin) {
        ClientOriginType originType = ClientOriginType.fromOriginString(origin);
        String deleteAccessTokenCookie = cookieUtil.deleteCookie(AuthConstant.ACCESS_TOKEN);
        String deleteRefreshTokenCookie = cookieUtil.deleteCookie(AuthConstant.REFRESH_TOKEN);

        if (refreshToken != null) {
            refreshTokenRepository.deleteByToken(refreshToken);
        }

        var response = ApiResponse.success(COMMON200);
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, originType.getClientOriginUrl() + UrlConstant.LOGIN_REDIRECT_PATH)
                .header(HttpHeaders.SET_COOKIE, deleteAccessTokenCookie)
                .header(HttpHeaders.SET_COOKIE, deleteRefreshTokenCookie)
                .body(response);
    }

    private ResponseEntity<ApiResponse<TestPublishTokenResponse>> getTokenResponse(
            String email, Long userId, ClientOriginType clientOriginType) {
        String accessToken = jwtUtil.createAccessToken(email, userId);
        String refreshToken = jwtUtil.createRefreshToken(email, userId);

        String accessTokenCookie = cookieUtil.createAccessTokenCookie(accessToken, clientOriginType);
        String refreshTokenCookie = cookieUtil.createResponseTokenCookie(refreshToken, clientOriginType);

        Instant refreshTokenExpiration =
                jwtUtil.getValidatedJwtToken(refreshToken).getExpiration();
        refreshTokenRepository.save(RefreshToken.create(refreshToken, email, refreshTokenExpiration));

        var response = TestPublishTokenResponse.of(userId == null, accessToken, refreshToken);
        var body = ApiResponse.success(COMMON200, response);
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, clientOriginType.getClientOriginUrl() + UrlConstant.LOGIN_REDIRECT_PATH)
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie)
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie)
                .body(body);
    }
}
