package com.shyashyashya.refit.global.oauth2.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.EXTERNAL_OAUTH2_SERVER_ERROR;
import static com.shyashyashya.refit.global.exception.ErrorCode.INVALID_OAUTH2_ACCESS_TOKEN;
import static com.shyashyashya.refit.global.exception.ErrorCode.INVALID_OAUTH2_CODE;

import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
import com.shyashyashya.refit.global.auth.service.JwtDecoder;
import com.shyashyashya.refit.global.auth.service.JwtEncoder;
import com.shyashyashya.refit.global.auth.service.JwtService;
import com.shyashyashya.refit.global.auth.service.validator.JwtValidator;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.model.ClientOriginType;
import com.shyashyashya.refit.global.oauth2.dto.OAuth2ResultDto;
import com.shyashyashya.refit.global.oauth2.dto.response.OAuth2LoginUrlResponse;
import com.shyashyashya.refit.global.property.OAuth2Property;
import com.shyashyashya.refit.global.util.CurrentServerUrlUtil;
import java.time.Instant;
import java.util.Optional;
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

    private final JwtService jwtService;
    private final UserRepository userRepository;

    private final OAuth2Property oauth2Property;
    private final CurrentServerUrlUtil currentServerUrlUtil;
    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    private final JwtValidator jwtValidator;
    private final RestClient restClient;

    @Override
    public OAuth2LoginUrlResponse buildOAuth2LoginUrl(ClientOriginType clientOriginType) {
        String googleClientId = oauth2Property.google().clientId();
        String scope = String.join(" ", oauth2Property.google().scope());
        String responseType = "code";

        String loginUrlResponseUrl = UriComponentsBuilder.fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
                .queryParam("client_id", googleClientId)
                .queryParam("redirect_uri", getRedirectUri())
                .queryParam("response_type", responseType)
                .queryParam("scope", scope)
                .queryParam("state", jwtEncoder.encodeOAuth2StateJwt(clientOriginType, Instant.now()))
                .toUriString();
        return OAuth2LoginUrlResponse.from(loginUrlResponseUrl);
    }

    @Transactional
    @Override
    public OAuth2ResultDto handleOAuth2Callback(String code, String state) {
        var oAuth2StateJwt = jwtDecoder.decodeOAuth2StateJwt(state);
        jwtValidator.validateOAuth2StateJwtNotExpired(oAuth2StateJwt);
        ClientOriginType clientOriginType = jwtDecoder.getClientOriginType(oAuth2StateJwt);

        var tokenResponse = fetchAccessToken(code);
        var userInfo = fetchUserInfo(tokenResponse.access_token());

        Optional<User> userOptional = userRepository.findByEmail(userInfo.email());
        Long userId = userOptional.map(User::getId).orElse(null);

        TokenPairDto tokenPair = jwtService.publishTokenPair(userInfo.email(), userId);
        return userOptional
                .map(user -> OAuth2ResultDto.of(
                        tokenPair, userId, user.getNickname(), user.getProfileImageUrl(), clientOriginType))
                .orElseGet(() ->
                        OAuth2ResultDto.of(tokenPair, userId, userInfo.name(), userInfo.picture(), clientOriginType));
    }

    private String getRedirectUri() {
        return currentServerUrlUtil.getServerUrl() + oauth2Property.google().redirectPath();
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
                    throw new CustomException(INVALID_OAUTH2_CODE);
                })
                .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
                    log.info("Google Access Token 5xx Error: Status={}", response.getStatusCode());
                    throw new CustomException(EXTERNAL_OAUTH2_SERVER_ERROR);
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
                    throw new CustomException(INVALID_OAUTH2_ACCESS_TOKEN);
                })
                .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
                    log.info("Google UserInfo 5xx Error: Status={}", response.getStatusCode());
                    throw new CustomException(EXTERNAL_OAUTH2_SERVER_ERROR);
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
