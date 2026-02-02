package com.shyashyashya.refit.global.auth.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.EXTERNAL_OAUTH_SERVER_ERROR;
import static com.shyashyashya.refit.global.exception.ErrorCode.INVALID_OAUTH_ACCESS_TOKEN;
import static com.shyashyashya.refit.global.exception.ErrorCode.INVALID_OAUTH_CODE;

import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.auth.dto.OAuthResult;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.property.OAuth2Property;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
@Slf4j
// TODO: RefreshToken 처리, RefreshToken redis 등에 저장 구현하기
public class GoogleOAuthService implements OAuthService {

    private final OAuth2Property oauth2Property;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RestClient.Builder restClientBuilder;

    @Override
    public String getOAuthLoginUrl() {
        String googleClientId = oauth2Property.google().clientId();
        String redirectUri = oauth2Property.google().redirectUri();
        String scope = String.join(" ", oauth2Property.google().scope());
        String responseType = "code";
        return UriComponentsBuilder.fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
                .queryParam("client_id", googleClientId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", responseType)
                .queryParam("scope", scope)
                .toUriString();
    }

    @Override
    public OAuthResult handleOAuthCallback(String code) {
        var tokenResponse = fetchAccessToken(code);
        var userInfo = fetchUserInfo(tokenResponse.access_token());

        return userRepository
                .findByEmail(userInfo.email())
                .map(user -> {
                    var accessToken = jwtUtil.createAccessToken(user.getEmail(), user.getId());
                    var refreshToken = jwtUtil.createRefreshToken(user.getEmail(), user.getId());
                    return OAuthResult.builder()
                            .accessToken(accessToken)
                            .refreshToken(Optional.of(refreshToken))
                            .nickname(user.getNickname())
                            .profileImageUrl(user.getProfileImageUrl())
                            .isNeedSignup(false)
                            .build();
                })
                .orElseGet(() -> {
                    var accessToken = jwtUtil.createAccessToken(userInfo.email(), null);
                    return OAuthResult.builder()
                            .accessToken(accessToken)
                            .refreshToken(Optional.empty())
                            .isNeedSignup(true)
                            .nickname(userInfo.name())
                            .profileImageUrl(userInfo.picture())
                            .build();
                });
    }

    private GoogleTokenResponse fetchAccessToken(String code) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("client_id", oauth2Property.google().clientId());
        body.add("client_secret", oauth2Property.google().clientSecret());
        body.add("redirect_uri", oauth2Property.google().redirectUri());
        body.add("grant_type", "authorization_code");

        return restClientBuilder
                .build()
                .post()
                .uri("https://oauth2.googleapis.com/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED) // OAuth 2.0 표준 규격
                .body(body)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    log.info("Google Access Token 4xx Error: Status={}, Code={}", response.getStatusCode(), code);
                    throw new CustomException(INVALID_OAUTH_CODE);
                })
                .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
                    log.info("Google Access Token 5xx Error: Status={}", response.getStatusCode());
                    throw new CustomException(EXTERNAL_OAUTH_SERVER_ERROR);
                })
                .body(GoogleTokenResponse.class);
    }

    private GoogleUserInfo fetchUserInfo(String accessToken) {
        return restClientBuilder
                .build()
                .get()
                .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                .header("Authorization", "Bearer " + accessToken) // 액세스 토큰 전송
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    log.info("Google UserInfo 4xx Error: Status={}", response.getStatusCode());
                    throw new CustomException(INVALID_OAUTH_ACCESS_TOKEN);
                })
                .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
                    log.info("Google UserInfo 5xx Error: Status={}", response.getStatusCode());
                    throw new CustomException(EXTERNAL_OAUTH_SERVER_ERROR);
                })
                .body(GoogleUserInfo.class);
    }

    private record GoogleTokenResponse(
            String access_token,
            String expires_in,
            String refresh_token,
            String scope,
            String token_type,
            String id_token) {}

    private record GoogleUserInfo(String sub, String name, String email, String picture) {}
}
