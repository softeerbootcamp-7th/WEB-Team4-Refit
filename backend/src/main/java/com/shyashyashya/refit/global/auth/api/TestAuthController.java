package com.shyashyashya.refit.global.auth.api;

import static com.shyashyashya.refit.global.exception.ErrorCode.USER_NOT_FOUND;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
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
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Test Auth/User API", description = "개발용 테스트 인증/인가 API입니다.")
@RestController
@RequestMapping("/test/auth/token")
@RequiredArgsConstructor
public class TestAuthController {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final CookieUtil cookieUtil;
    private final JwtUtil jwtUtil;

    @Operation(summary = "(테스트용) 게스트 회원 토큰을 발급합니다.", description = "발급된 토큰은 요청 주소에 쿠키로 세팅됩니다.")
    @GetMapping("/guest")
    public ResponseEntity<ApiResponse<TokenPairDto>> getGuestToken(
            @RequestParam("email") @NotNull @Email String email, @RequestParam(required = false) String env) {
        return getTokenResponse(email, null, env);
    }

    @Operation(summary = "(테스트용) 회원 토큰을 발급합니다.", description = "발급된 토큰은 요청 주소에 쿠키로 세팅됩니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<TokenPairDto>> getToken(
            @RequestParam("email") @NotNull @Email String email, @RequestParam(required = false) String env) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(USER_NOT_FOUND));
        return getTokenResponse(user.getEmail(), user.getId(), env);
    }

    @Operation(summary = "(테스트용) 쿠키에 설정된 토큰들을 삭제합니다.")
    @DeleteMapping("/cookies")
    public ResponseEntity<ApiResponse<Void>> deleteTokenCookies(
            @CookieValue(value = AuthConstant.REFRESH_TOKEN, required = false) String refreshToken,
            @RequestParam(required = false) String origin) {
        String deleteAccessTokenCookie = cookieUtil.deleteCookie(AuthConstant.ACCESS_TOKEN);
        String deleteRefreshTokenCookie = cookieUtil.deleteCookie(AuthConstant.REFRESH_TOKEN);

        if (refreshToken != null) {
            refreshTokenRepository.deleteByToken(refreshToken);
        }

        var response = ApiResponse.success(COMMON200);
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(
                        HttpHeaders.LOCATION,
                        ClientOriginType.getClientOriginUrl(origin) + UrlConstant.LOGIN_REDIRECT_PATH)
                .header(HttpHeaders.SET_COOKIE, deleteAccessTokenCookie)
                .header(HttpHeaders.SET_COOKIE, deleteRefreshTokenCookie)
                .body(response);
    }

    private ResponseEntity<ApiResponse<TokenPairDto>> getTokenResponse(String email, Long userId, String origin) {
        String accessToken = jwtUtil.createAccessToken(email, userId);
        String refreshToken = jwtUtil.createRefreshToken(email, userId);

        String accessTokenCookie = cookieUtil.createAccessTokenCookie(accessToken);
        String refreshTokenCookie = cookieUtil.createResponseTokenCookie(refreshToken);

        var refreshTokenExpiration = jwtUtil.getValidatedJwtToken(refreshToken).getExpiration();
        refreshTokenRepository.save(RefreshToken.create(refreshToken, email, refreshTokenExpiration));

        var body = ApiResponse.success(COMMON200, TokenPairDto.of(accessToken, refreshToken));
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(
                        HttpHeaders.LOCATION,
                        ClientOriginType.getClientOriginUrl(origin) + UrlConstant.LOGIN_REDIRECT_PATH)
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie)
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie)
                .body(body);
    }
}
