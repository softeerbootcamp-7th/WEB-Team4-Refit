package com.shyashyashya.refit.global.auth.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.global.exception.ErrorCode.USER_NOT_FOUND;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
import com.shyashyashya.refit.global.auth.model.RefreshToken;
import com.shyashyashya.refit.global.auth.repository.RefreshTokenRepository;
import com.shyashyashya.refit.global.auth.service.CookieUtil;
import com.shyashyashya.refit.global.auth.service.JwtUtil;
import com.shyashyashya.refit.global.constant.AuthConstant;
import com.shyashyashya.refit.global.exception.CustomException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
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

    @GetMapping("/guest")
    public ResponseEntity<CommonResponse<TokenPairDto>> getGuestToken(
            @RequestParam("email") @NotNull @Email String email) {
        return getTokenResponse(email, null);
    }

    @GetMapping
    public ResponseEntity<CommonResponse<TokenPairDto>> getToken(@RequestParam("email") @NotNull @Email String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(USER_NOT_FOUND));
        return getTokenResponse(user.getEmail(), user.getId());
    }

    @DeleteMapping("/cookies")
    public ResponseEntity<CommonResponse<Void>> deleteTokenCookies(
            @CookieValue(value = AuthConstant.REFRESH_TOKEN, required = false) String refreshToken) {
        String deleteAccessTokenCookie = cookieUtil.deleteCookie(AuthConstant.ACCESS_TOKEN);
        String deleteRefreshTokenCookie = cookieUtil.deleteCookie(AuthConstant.REFRESH_TOKEN);

        if (refreshToken != null) {
            refreshTokenRepository.deleteByToken(refreshToken);
        }

        var response = CommonResponse.success(COMMON200);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteAccessTokenCookie)
                .header(HttpHeaders.SET_COOKIE, deleteRefreshTokenCookie)
                .body(response);
    }

    private ResponseEntity<CommonResponse<TokenPairDto>> getTokenResponse(String email, Long userId) {
        String accessToken = jwtUtil.createAccessToken(email, userId);
        String refreshToken = jwtUtil.createRefreshToken(email);

        String accessTokenCookie = cookieUtil.createAccessTokenCookie(accessToken);
        String refreshTokenCookie = cookieUtil.createResponseTokenCookie(refreshToken);

        refreshTokenRepository.save(RefreshToken.create(refreshToken, email, jwtUtil.getExpiration(refreshToken)));

        var body = CommonResponse.success(COMMON200, TokenPairDto.of(accessToken, refreshToken));
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie)
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie)
                .body(body);
    }
}
