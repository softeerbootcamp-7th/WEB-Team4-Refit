package com.shyashyashya.refit.global.util;

import com.shyashyashya.refit.global.constant.AuthConstant;
import com.shyashyashya.refit.global.constant.UrlConstant;
import com.shyashyashya.refit.global.model.ClientOriginType;
import com.shyashyashya.refit.global.property.AuthJwtProperty;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CookieUtil {

    private final AuthJwtProperty authJwtProperty;

    public String extractCookieValue(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }

        return Arrays.stream(cookies)
                .filter(cookie -> cookieName.equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
    }

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

        if (originType.getClientOriginUrl().contains(UrlConstant.APP_DOMAIN)) {
            builder.domain(UrlConstant.APP_DOMAIN);
        }

        return builder.build();
    }
}
