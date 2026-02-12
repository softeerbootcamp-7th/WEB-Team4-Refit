package com.shyashyashya.refit.global.auth.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.TOKEN_EXPIRED;
import static com.shyashyashya.refit.global.exception.ErrorCode.TOKEN_REQUIRED;
import static com.shyashyashya.refit.global.exception.ErrorCode.TOKEN_VALIDATION_FAILED;

import com.shyashyashya.refit.global.auth.model.JwtTokenType;
import com.shyashyashya.refit.global.auth.model.ValidatedJwtToken;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.property.AuthJwtProperty;
import com.shyashyashya.refit.global.property.OAuth2Property;
import com.shyashyashya.refit.global.util.ClientOriginType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JwtUtil {

    private static final String CLAIM_KEY_JWT_TOKEN_TYPE = "type";
    private static final String CLAIM_KEY_USER_ID = "userId";

    private final Key key;
    private final Duration accessTokenExpiration;
    private final Duration refreshTokenExpiration;
    private final Duration oAuth2StateTokenExpiration;
    private final JwtParser jwtParser;

    public JwtUtil(AuthJwtProperty authJwtProperty, OAuth2Property oAuth2Property) {
        this.key = Keys.hmacShaKeyFor(authJwtProperty.secret().getBytes());
        this.accessTokenExpiration = authJwtProperty.tokenExpiration().accessToken();
        this.refreshTokenExpiration = authJwtProperty.tokenExpiration().refreshToken();
        this.oAuth2StateTokenExpiration = oAuth2Property.stateExpiration();
        this.jwtParser = Jwts.parserBuilder().setSigningKey(key).build();
    }

    public String createAccessToken(@NotNull String email, @Nullable Long userId) {
        return createAccessOrRefreshJwtToken(email, userId, accessTokenExpiration, JwtTokenType.ACCESS_TOKEN);
    }

    public String createRefreshToken(@NotNull String email, @Nullable Long userId) {
        return createAccessOrRefreshJwtToken(email, userId, refreshTokenExpiration, JwtTokenType.REFRESH_TOKEN);
    }

    public String createOAuth2StateToken(ClientOriginType clientOriginType) {
        var now = Instant.now();
        var expiration = now.plus(oAuth2StateTokenExpiration);

        return Jwts.builder()
                .setSubject(clientOriginType.getOriginType())
                .claim(CLAIM_KEY_JWT_TOKEN_TYPE, JwtTokenType.OAUTH2_STATE_TOKEN)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public ValidatedJwtToken getValidatedJwtToken(String token) {
        var jwtToken = getValidatedJwtTokenAllowExpired(token);
        if (jwtToken.isExpired()) {
            throw new CustomException(TOKEN_EXPIRED);
        }
        return jwtToken;
    }

    public ValidatedJwtToken getValidatedJwtTokenAllowExpired(String token) {
        try {
            if (token == null || token.isBlank()) {
                throw new CustomException(TOKEN_REQUIRED);
            }

            Claims claims = jwtParser.parseClaimsJws(token).getBody();
            return ValidatedJwtToken.createUnexpiredToken(claims, extractJwtTokenTypeOrThrow(claims));

        } catch (ExpiredJwtException e) {
            Claims claims = e.getClaims();
            return ValidatedJwtToken.createExpiredToken(claims, extractJwtTokenTypeOrThrow(claims));

        } catch (JwtException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            throw new CustomException(TOKEN_VALIDATION_FAILED);
        }
    }

    public ClientOriginType getClientOriginType(ValidatedJwtToken validatedJwtToken) {
        validateOAuth2StateType(validatedJwtToken);
        return ClientOriginType.fromOriginTypeString(validatedJwtToken.claims().getSubject());
    }

    public String getEmail(ValidatedJwtToken validatedJwtToken) {
        validateAccessOrRefreshType(validatedJwtToken);
        return validatedJwtToken.claims().getSubject();
    }

    public Optional<Long> getUserId(ValidatedJwtToken validatedJwtToken) {
        validateAccessOrRefreshType(validatedJwtToken);
        return Optional.ofNullable(validatedJwtToken.claims().get(CLAIM_KEY_USER_ID, Long.class));
    }

    private void validateAccessOrRefreshType(ValidatedJwtToken jwtToken) {
        if (jwtToken.type() != JwtTokenType.ACCESS_TOKEN && jwtToken.type() != JwtTokenType.REFRESH_TOKEN) {
            log.warn("ACCESS_TOKEN or REFRESH_TOKEN type expected.");
            throw new CustomException(TOKEN_VALIDATION_FAILED);
        }
    }

    private void validateOAuth2StateType(ValidatedJwtToken jwtToken) {
        if (jwtToken.type() != JwtTokenType.OAUTH2_STATE_TOKEN) {
            log.warn("OAUTH2_STATE_TOKEN type expected.");
            throw new CustomException(TOKEN_VALIDATION_FAILED);
        }
    }

    private String createAccessOrRefreshJwtToken(
            @NotNull String email,
            @Nullable Long userId,
            @NotNull Duration expirationDuration,
            @NotNull JwtTokenType jwtTokenType) {

        if (jwtTokenType == JwtTokenType.OAUTH2_STATE_TOKEN) {
            throw new IllegalArgumentException("ACCESS_TOKEN or REFRESH_TOKEN type expected.");
        }

        var now = Instant.now();
        var expiration = now.plus(expirationDuration);

        var builder = Jwts.builder()
                .setSubject(email)
                .claim(CLAIM_KEY_JWT_TOKEN_TYPE, jwtTokenType)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiration))
                .signWith(key, SignatureAlgorithm.HS256);

        if (userId != null) {
            builder.claim(CLAIM_KEY_USER_ID, userId);
        }

        return builder.compact();
    }

    private JwtTokenType extractJwtTokenTypeOrThrow(Claims claims) {
        try {
            String jwtTokenType = claims.get(CLAIM_KEY_JWT_TOKEN_TYPE, String.class);
            return JwtTokenType.valueOf(jwtTokenType);
        } catch (NullPointerException | IllegalArgumentException e) {
            log.warn("Failed to extract JWT token type: {}", e.getMessage());
            throw new CustomException(TOKEN_VALIDATION_FAILED);
        }
    }
}
