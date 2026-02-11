package com.shyashyashya.refit.global.auth.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.TOKEN_EXPIRED;
import static com.shyashyashya.refit.global.exception.ErrorCode.TOKEN_REQUIRED;
import static com.shyashyashya.refit.global.exception.ErrorCode.TOKEN_VALIDATION_FAILED;

import com.shyashyashya.refit.global.auth.model.DecodedJwtType;
import com.shyashyashya.refit.global.auth.model.DecodedJwt;
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
        return createAccessOrRefreshJwtToken(email, userId, accessTokenExpiration, DecodedJwtType.ACCESS_TOKEN);
    }

    public String createRefreshToken(@NotNull String email, @Nullable Long userId) {
        return createAccessOrRefreshJwtToken(email, userId, refreshTokenExpiration, DecodedJwtType.REFRESH_TOKEN);
    }

    public String createOAuth2StateToken(ClientOriginType clientOriginType) {
        var now = Instant.now();
        var expiration = now.plus(oAuth2StateTokenExpiration);

        return Jwts.builder()
                .setSubject(clientOriginType.getOriginType())
                .claim(CLAIM_KEY_JWT_TOKEN_TYPE, DecodedJwtType.OAUTH2_STATE_TOKEN)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public DecodedJwt getValidatedJwtToken(String token) {
        var jwtToken = getValidatedJwtTokenAllowExpired(token);
        if (jwtToken.isExpired()) {
            throw new CustomException(TOKEN_EXPIRED);
        }
        return jwtToken;
    }

    public DecodedJwt getValidatedJwtTokenAllowExpired(String token) {
        try {
            if (token == null || token.isBlank()) {
                throw new CustomException(TOKEN_REQUIRED);
            }

            Claims claims = jwtParser.parseClaimsJws(token).getBody();
            return DecodedJwt.createUnexpiredToken(claims, extractJwtTokenTypeOrThrow(claims));

        } catch (ExpiredJwtException e) {
            Claims claims = e.getClaims();
            return DecodedJwt.createExpiredToken(claims, extractJwtTokenTypeOrThrow(claims));

        } catch (JwtException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            throw new CustomException(TOKEN_VALIDATION_FAILED);
        }
    }

    public ClientOriginType getClientOriginType(DecodedJwt decodedJwt) {
        validateOAuth2StateType(decodedJwt);
        return ClientOriginType.fromOriginString(decodedJwt.claims().getSubject());
    }

    public String getEmail(DecodedJwt decodedJwt) {
        validateAccessOrRefreshType(decodedJwt);
        return decodedJwt.claims().getSubject();
    }

    public Optional<Long> getUserId(DecodedJwt decodedJwt) {
        validateAccessOrRefreshType(decodedJwt);
        return Optional.ofNullable(decodedJwt.claims().get(CLAIM_KEY_USER_ID, Long.class));
    }

    private void validateAccessOrRefreshType(DecodedJwt jwtToken) {
        if (jwtToken.type() != DecodedJwtType.ACCESS_TOKEN && jwtToken.type() != DecodedJwtType.REFRESH_TOKEN) {
            log.warn("ACCESS_TOKEN or REFRESH_TOKEN type expected.");
            throw new CustomException(TOKEN_VALIDATION_FAILED);
        }
    }

    private void validateOAuth2StateType(DecodedJwt jwtToken) {
        if (jwtToken.type() != DecodedJwtType.OAUTH2_STATE_TOKEN) {
            log.warn("OAUTH2_STATE_TOKEN type expected.");
            throw new CustomException(TOKEN_VALIDATION_FAILED);
        }
    }

    private String createAccessOrRefreshJwtToken(
            @NotNull String email,
            @Nullable Long userId,
            @NotNull Duration expirationDuration,
            @NotNull DecodedJwtType jwtTokenType) {

        if (jwtTokenType == DecodedJwtType.OAUTH2_STATE_TOKEN) {
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

    private DecodedJwtType extractJwtTokenTypeOrThrow(Claims claims) {
        try {
            String jwtTokenType = claims.get(CLAIM_KEY_JWT_TOKEN_TYPE, String.class);
            return DecodedJwtType.valueOf(jwtTokenType);
        } catch (NullPointerException | IllegalArgumentException e) {
            log.warn("Failed to extract JWT token type: {}", e.getMessage());
            throw new CustomException(TOKEN_VALIDATION_FAILED);
        }
    }
}
