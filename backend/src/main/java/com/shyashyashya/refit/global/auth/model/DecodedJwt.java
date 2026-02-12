package com.shyashyashya.refit.global.auth.model;

import com.shyashyashya.refit.global.constant.AuthConstant;
import io.jsonwebtoken.Claims;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;

@Builder(access = lombok.AccessLevel.PRIVATE)
@Slf4j
public record DecodedJwt(Claims claims, DecodedJwtType type, boolean isExpired) {

    public static DecodedJwt createUnexpired(Claims claims) {
        return DecodedJwt.builder()
                .claims(claims)
                .isExpired(false)
                .type(extractDecodedJwtTypeOrThrow(claims))
                .build();
    }

    public static DecodedJwt createExpired(Claims claims) {
        return DecodedJwt.builder()
                .claims(claims)
                .isExpired(true)
                .type(extractDecodedJwtTypeOrThrow(claims))
                .build();
    }

    private static DecodedJwtType extractDecodedJwtTypeOrThrow(Claims claims) {
        try {
            String jwtTokenType = claims.get(AuthConstant.CLAIM_KEY_JWT_TOKEN_TYPE, String.class);
            return DecodedJwtType.valueOf(jwtTokenType);
        } catch (NullPointerException | IllegalArgumentException e) {
            log.error("Failed to extract JWT token type: {}", e.getMessage());
            throw new IllegalStateException(e);
        }
    }
}
