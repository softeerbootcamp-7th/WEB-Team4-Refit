package com.shyashyashya.refit.global.auth.model;

import io.jsonwebtoken.Claims;
import java.time.Instant;
import lombok.Builder;

@Builder(access = lombok.AccessLevel.PRIVATE)
public record DecodedJwt(Claims claims, boolean isExpired, DecodedJwtType type) {

    public Instant getExpiration() {
        return claims.getExpiration().toInstant();
    }

    public static DecodedJwt createUnexpiredToken(Claims claims, DecodedJwtType type) {
        return DecodedJwt.builder()
                .claims(claims)
                .isExpired(false)
                .type(type)
                .build();
    }

    public static DecodedJwt createExpiredToken(Claims claims, DecodedJwtType type) {
        return DecodedJwt.builder()
                .claims(claims)
                .isExpired(true)
                .type(type)
                .build();
    }
}
