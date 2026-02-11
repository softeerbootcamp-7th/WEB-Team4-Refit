package com.shyashyashya.refit.global.auth.service;

import com.shyashyashya.refit.global.constant.AuthConstant;
import com.shyashyashya.refit.global.constant.UrlConstant;
import com.shyashyashya.refit.global.property.AuthJwtProperty;
import com.shyashyashya.refit.global.property.AuthProperty;
import com.shyashyashya.refit.global.util.ClientOriginType;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CookieUtil {

    private final AuthProperty authProperty;
    private final AuthJwtProperty authJwtProperty;

    public String createAccessTokenCookie(String accessToken, ClientOriginType originType) {
        return createCookie(
                        AuthConstant.ACCESS_TOKEN,
                        accessToken,
                        authJwtProperty.tokenExpiration().accessToken(),
                        originType)
                .toString();
    }

    public String createResponseTokenCookie(String refreshToken, ClientOriginType originType) {
        return createCookie(
                        AuthConstant.REFRESH_TOKEN,
                        refreshToken,
                        authJwtProperty.tokenExpiration().refreshToken(),
                        originType)
                .toString();
    }

    public String deleteCookie(String name) {
        return ResponseCookie.from(name, "").maxAge(0).path("/").build().toString();
    }

    private ResponseCookie createCookie(String name, String value, Duration maxAge, ClientOriginType originType) {
        var builder = ResponseCookie.from(name, value).httpOnly(true).path("/").maxAge(maxAge);

        if (originType.getClientOriginUrl().contains(UrlConstant.DOMAIN_URL)) {
            builder.domain(UrlConstant.DOMAIN_URL);
        }

        return builder.build();
    }
}
