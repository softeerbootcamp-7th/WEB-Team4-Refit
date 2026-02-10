package com.shyashyashya.refit.global.auth.model;

import io.jsonwebtoken.Claims;
import java.time.Instant;
import lombok.Builder;

@Builder(access = lombok.AccessLevel.PRIVATE)
public record ValidatedJwtToken(Claims claims, boolean isExpired, JwtTokenType type) {

    public Instant getExpiration() {
        return claims.getExpiration().toInstant();
    }

    public static ValidatedJwtToken createUnexpiredToken(Claims claims, JwtTokenType type) {
        return ValidatedJwtToken.builder()
                .claims(claims)
                .isExpired(false)
                .type(type)
                .build();
    }

    public static ValidatedJwtToken createExpiredToken(Claims claims, JwtTokenType type) {
        return ValidatedJwtToken.builder()
                .claims(claims)
                .isExpired(true)
                .type(type)
                .build();
    }
}
