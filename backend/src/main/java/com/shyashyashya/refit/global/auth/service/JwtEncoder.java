package com.shyashyashya.refit.global.auth.service;

import com.shyashyashya.refit.global.auth.model.DecodedJwtType;
import com.shyashyashya.refit.global.constant.AuthConstant;
import com.shyashyashya.refit.global.model.ClientOriginType;
import com.shyashyashya.refit.global.property.AuthJwtProperty;
import com.shyashyashya.refit.global.property.OAuth2Property;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JwtEncoder {

    private final Key key;
    private final Duration accessTokenExpiration;
    private final Duration refreshTokenExpiration;
    private final Duration oAuth2StateTokenExpiration;

    public JwtEncoder(AuthJwtProperty authJwtProperty, OAuth2Property oAuth2Property) {
        this.key = Keys.hmacShaKeyFor(authJwtProperty.secret().getBytes());
        this.accessTokenExpiration = authJwtProperty.tokenExpiration().accessToken();
        this.refreshTokenExpiration = authJwtProperty.tokenExpiration().refreshToken();
        this.oAuth2StateTokenExpiration = oAuth2Property.stateExpiration();
    }

    public String encodeAccessJwt(@NotNull String email, @Nullable Long userId, Instant issuedAt) {
        return encodeAccessOrRefreshJwt(email, userId, accessTokenExpiration, DecodedJwtType.ACCESS_TOKEN, issuedAt);
    }

    public String encodeRefreshJwt(@NotNull String email, @Nullable Long userId, Instant issuedAt) {
        return encodeAccessOrRefreshJwt(email, userId, refreshTokenExpiration, DecodedJwtType.REFRESH_TOKEN, issuedAt);
    }

    public String encodeOAuth2StateJwt(ClientOriginType clientOriginType, Instant issuedAt) {
        return Jwts.builder()
                .setSubject(clientOriginType.getOriginType())
                .claim(AuthConstant.CLAIM_KEY_JWT_TOKEN_TYPE, DecodedJwtType.OAUTH2_STATE_TOKEN)
                .setIssuedAt(Date.from(issuedAt))
                .setExpiration(Date.from(issuedAt.plus(oAuth2StateTokenExpiration)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private String encodeAccessOrRefreshJwt(
            @NotNull String email,
            @Nullable Long userId,
            @NotNull Duration expirationDuration,
            @NotNull DecodedJwtType jwtTokenType,
            @NotNull Instant issuedAt) {

        if (jwtTokenType == DecodedJwtType.OAUTH2_STATE_TOKEN) {
            throw new IllegalArgumentException("ACCESS_TOKEN or REFRESH_TOKEN type expected.");
        }

        var builder = Jwts.builder().setSubject(email).claim(AuthConstant.CLAIM_KEY_JWT_TOKEN_TYPE, jwtTokenType);

        if (userId != null) {
            builder.claim(AuthConstant.CLAIM_KEY_USER_ID, userId);
        }

        return builder.setIssuedAt(Date.from(issuedAt))
                .setExpiration(Date.from(issuedAt.plus(expirationDuration)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
