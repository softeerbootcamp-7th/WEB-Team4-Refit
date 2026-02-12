package com.shyashyashya.refit.global.auth.api;

import static com.shyashyashya.refit.global.exception.ErrorCode.USER_NOT_FOUND;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
import com.shyashyashya.refit.global.auth.dto.response.TestPublishTokenResponse;
import com.shyashyashya.refit.global.auth.repository.RefreshTokenRepository;
import com.shyashyashya.refit.global.auth.service.JwtService;
import com.shyashyashya.refit.global.constant.AuthConstant;
import com.shyashyashya.refit.global.dto.ApiResponse;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.oauth2.util.ClientOriginRedirectUriBuilder;
import com.shyashyashya.refit.global.util.ClientOriginType;
import com.shyashyashya.refit.global.util.CookieUtil;
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
    private final JwtService jwtService;
    private final ClientOriginRedirectUriBuilder clientOriginRedirectUriBuilder;

    @Operation(
            summary = "(테스트용) Access&Refresh Token을 이메일을 통해 발급합니다.",
            description = "발급된 토큰은 origin에 따라 세팅됩니다. response body에 회원가입 필요 여부 및 토큰 정보가 포함됩니다.")
    @GetMapping("/token")
    public ResponseEntity<ApiResponse<TestPublishTokenResponse>> publishToken(
            @RequestParam("email") @NotNull @Email String email, @RequestParam(required = false) String originType) {
        ClientOriginType clientOriginType = ClientOriginType.fromOriginTypeString(originType);
        Long userId = userRepository.findByEmail(email).map(User::getId).orElse(null);
        return getTokenResponse(email, userId, clientOriginType);
    }

    @Operation(
            summary = "(테스트용) Access&Refresh Token을 사용자 아이디를 통해 발급합니다.",
            description = "발급된 토큰은 origin에 따라 세팅됩니다. response body에 회원가입 필요 여부 및 토큰 정보가 포함됩니다.")
    @GetMapping("/token/{userId}")
    public ResponseEntity<ApiResponse<TestPublishTokenResponse>> publishTokenByUserId(
            @PathVariable @NotNull Long userId, @RequestParam(required = false) String originType) {
        ClientOriginType clientOriginType = ClientOriginType.fromOriginTypeString(originType);
        User user = userRepository.findById(userId).orElseThrow(() -> new CustomException(USER_NOT_FOUND));
        return getTokenResponse(user.getEmail(), userId, clientOriginType);
    }

    @Operation(summary = "(테스트용) 쿠키에 설정된 토큰들을 삭제합니다.")
    @DeleteMapping("/cookies")
    public ResponseEntity<ApiResponse<Void>> deleteTokenCookies(
            @CookieValue(value = AuthConstant.REFRESH_TOKEN, required = false) String refreshToken,
            @RequestParam(required = false) String originType) {
        ClientOriginType clientOriginType = ClientOriginType.fromOriginTypeString(originType);
        String deleteAccessTokenCookie = cookieUtil.deleteCookie(AuthConstant.ACCESS_TOKEN);
        String deleteRefreshTokenCookie = cookieUtil.deleteCookie(AuthConstant.REFRESH_TOKEN);

        if (refreshToken != null) {
            refreshTokenRepository.deleteByToken(refreshToken);
        }

        var response = ApiResponse.success(COMMON200);
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, clientOriginRedirectUriBuilder.build(clientOriginType))
                .header(HttpHeaders.SET_COOKIE, deleteAccessTokenCookie)
                .header(HttpHeaders.SET_COOKIE, deleteRefreshTokenCookie)
                .body(response);
    }

    private ResponseEntity<ApiResponse<TestPublishTokenResponse>> getTokenResponse(
            String email, Long userId, ClientOriginType clientOriginType) {

        TokenPairDto tokenPair = jwtService.publishTokenPair(email, userId);
        String accessTokenCookie = cookieUtil.createAccessTokenCookie(tokenPair.accessToken(), clientOriginType);
        String refreshTokenCookie = cookieUtil.createResponseTokenCookie(tokenPair.refreshToken(), clientOriginType);

        var response = TestPublishTokenResponse.of(userId == null, tokenPair);
        var body = ApiResponse.success(COMMON200, response);
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, clientOriginRedirectUriBuilder.build(clientOriginType))
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie)
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie)
                .body(body);
    }
}
