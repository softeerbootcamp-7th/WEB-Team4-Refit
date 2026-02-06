package com.shyashyashya.refit.global.oauth2.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.EXTERNAL_OAUTH_SERVER_ERROR;
import static com.shyashyashya.refit.global.exception.ErrorCode.INVALID_OAUTH_ACCESS_TOKEN;
import static com.shyashyashya.refit.global.exception.ErrorCode.INVALID_OAUTH_CODE;

import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.auth.model.RefreshToken;
import com.shyashyashya.refit.global.auth.repository.RefreshTokenRepository;
import com.shyashyashya.refit.global.auth.service.JwtUtil;
import com.shyashyashya.refit.global.constant.EnvironmentType;
import com.shyashyashya.refit.global.constant.UrlConstant;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.oauth2.dto.OAuth2LoginUrlResponse;
import com.shyashyashya.refit.global.oauth2.dto.OAuth2ResultDto;
import com.shyashyashya.refit.global.property.OAuth2Property;
import com.shyashyashya.refit.global.util.CurrentProfile;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
@Slf4j
// TODO: RefreshToken을 redis 등에 저장하는 것 고려
public class GoogleOAuth2Service implements OAuth2Service {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    private final OAuth2Property oauth2Property;
    private final CurrentProfile currentProfile;
    private final JwtUtil jwtUtil;
    private final RestClient restClient;

    // TODO: 추후 별도의 DB, 또는 Redis에 저장할 수 있도록 구현
    // TODO: 또는 state 자체를 JWT로 발급해 stateless로 구현하기
    private final Map<String, EnvironmentType> stateMap = new ConcurrentHashMap<>();

    @Override
    public OAuth2LoginUrlResponse buildOAuth2LoginUrl(EnvironmentType environmentType) {
        String googleClientId = oauth2Property.google().clientId();
        String redirectUri = getRedirectUri();
        String scope = String.join(" ", oauth2Property.google().scope());
        String responseType = "code";

        String loginUrlResponseUrl = UriComponentsBuilder.fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
                .queryParam("client_id", googleClientId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", responseType)
                .queryParam("scope", scope)
                .queryParam("state", createState(environmentType))
                .toUriString();
        return OAuth2LoginUrlResponse.from(loginUrlResponseUrl);
    }

    @Transactional
    @Override
    public OAuth2ResultDto handleOAuth2Callback(String code, String state) {
        var tokenResponse = fetchAccessToken(code);
        var userInfo = fetchUserInfo(tokenResponse.access_token());

        var userOptional = userRepository.findByEmail(userInfo.email());
        var userId = userOptional.map(User::getId).orElse(null);

        var accessToken = jwtUtil.createAccessToken(userInfo.email(), userId);
        var refreshToken = jwtUtil.createRefreshToken(userInfo.email(), userId);

        refreshTokenRepository.save(
                RefreshToken.create(refreshToken, userInfo.email(), jwtUtil.getExpiration(refreshToken)));

        EnvironmentType environmentType = getEnvironmentTypeFromStateOrThrow(state);
        String frontendRedirectUrl = buildFrontendRedirectUrl(environmentType);

        return userOptional
                .map(user -> OAuth2ResultDto.createUser(accessToken, refreshToken, user, frontendRedirectUrl))
                .orElseGet(() -> OAuth2ResultDto.createGuest(accessToken, refreshToken, userInfo, frontendRedirectUrl));
    }

    private String createState(EnvironmentType environmentType) {
        String state = UUID.randomUUID().toString();
        stateMap.put(state, environmentType);
        return state;
    }

    private EnvironmentType getEnvironmentTypeFromStateOrThrow(String state) {
        return Optional.ofNullable(stateMap.get(state))
                .orElseThrow(() -> new IllegalStateException("Unregistered state value: " + state));
    }

    private String buildFrontendRedirectUrl(EnvironmentType environmentType) {
        return switch (environmentType) {
                    case LOCAL -> UrlConstant.LOCAL_CLIENT_URL;
                    case DEV -> UrlConstant.DEV_CLIENT_URL;
                    case MAIN -> UrlConstant.MAIN_CLIENT_URL;
                }
                + UrlConstant.LOGIN_REDIRECT_PATH;
    }

    private String getRedirectUri() {
        return currentProfile.getServerUrl() + oauth2Property.google().redirectPath();
    }

    private GoogleTokenResponse fetchAccessToken(String code) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("client_id", oauth2Property.google().clientId());
        body.add("client_secret", oauth2Property.google().clientSecret());
        body.add("redirect_uri", getRedirectUri());
        body.add("grant_type", "authorization_code");

        return restClient
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
        return restClient
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

    public record GoogleTokenResponse(
            String access_token,
            String expires_in,
            String refresh_token,
            String scope,
            String token_type,
            String id_token) {}

    public record GoogleUserInfo(String sub, String name, String email, String picture) {}
}
