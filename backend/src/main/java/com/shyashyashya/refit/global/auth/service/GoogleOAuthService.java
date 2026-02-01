package com.shyashyashya.refit.global.auth.service;

import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.auth.dto.OAuthResult;
import com.shyashyashya.refit.global.property.AuthProperty;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class GoogleOAuthService implements OAuthService {

    private final AuthProperty authProperty;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RestClient restClient = RestClient.create();

    @Override
    public String getOAuthLoginUrl() {
        String googleClientId = authProperty.google().clientId();
        String redirectUri = authProperty.google().redirectUri();
        String scope = String.join(" ", authProperty.google().scope());
        String responseType = "code";
        return "https://accounts.google.com/o/oauth2/v2/auth" + "?client_id="
                + googleClientId + "&redirect_uri="
                + redirectUri + "&response_type="
                + responseType + "&scope="
                + scope;
    }

    @Override
    public OAuthResult handleOAuthCallback(String code) {
        var tokenResponse = fetchAccessToken(code);
        var userInfo = fetchUserInfo(tokenResponse.access_token());

        var userOptional = userRepository.findByEmail(userInfo.email());

        if (userOptional.isPresent()) {
            var user = userOptional.get();
            var accessToken = jwtUtil.createAccessToken(user.getEmail(), user.getId());
            var refreshToken = jwtUtil.createRefreshToken(user.getEmail(), user.getId());
            return OAuthResult.builder()
                    .accessToken(accessToken)
                    .refreshToken(Optional.of(refreshToken))
                    .nickname(user.getNickname())
                    .profileImageUrl(user.getProfileImageUrl())
                    .isNeedSignup(false)
                    .build();
        }

        var accessToken = jwtUtil.createAccessToken(userInfo.email(), null);
        return OAuthResult.builder()
                .accessToken(accessToken)
                .refreshToken(Optional.empty())
                .isNeedSignup(true)
                .nickname(userInfo.name())
                .profileImageUrl(userInfo.picture())
                .build();
    }

    private GoogleTokenResponse fetchAccessToken(String code) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("client_id", authProperty.google().clientId());
        body.add("client_secret", authProperty.google().clientSecret());
        body.add("redirect_uri", authProperty.google().redirectUri());
        body.add("grant_type", "authorization_code");

        return restClient
                .post()
                .uri("https://oauth2.googleapis.com/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED) // OAuth 2.0 표준 규격
                .body(body)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (request, response) -> {
                    throw new RuntimeException("Google Token Exchange Failed");
                })
                .body(GoogleTokenResponse.class);
    }

    private GoogleUserInfo fetchUserInfo(String accessToken) {
        return restClient
                .get()
                .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                .header("Authorization", "Bearer " + accessToken) // 액세스 토큰 전송
                .retrieve()
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
