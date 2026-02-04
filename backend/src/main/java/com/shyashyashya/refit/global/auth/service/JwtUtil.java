package com.shyashyashya.refit.global.auth.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.LOGIN_REQUIRED;
import static com.shyashyashya.refit.global.exception.ErrorCode.TOKEN_EXPIRED;

import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.property.AuthJwtProperty;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
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

    private final Key key;
    private final Duration accessTokenExpiration;
    private final Duration refreshTokenExpiration;
    private final JwtParser jwtParser;

    public JwtUtil(AuthJwtProperty authJwtProperty) {
        this.key = Keys.hmacShaKeyFor(authJwtProperty.secret().getBytes());
        this.accessTokenExpiration = authJwtProperty.tokenExpiration().accessToken();
        this.refreshTokenExpiration = authJwtProperty.tokenExpiration().refreshToken();
        this.jwtParser = Jwts.parserBuilder().setSigningKey(key).build();
    }

    public String createAccessToken(@NotNull String email, @Nullable Long userId) {
        return createJwtToken(email, userId, accessTokenExpiration);
    }

    public String createRefreshToken(@NotNull String email, @Nullable Long userId) {
        return createJwtToken(email, userId, refreshTokenExpiration);
    }

    public String getEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public Optional<Long> getUserId(String token) {
        return Optional.ofNullable(parseClaims(token).get("userId", Long.class));
    }

    public Instant getExpiration(String token) {
        return parseClaims(token).getExpiration().toInstant();
    }

    public boolean isTokenExpired(String token) {
        Date expiration = parseClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    public void validateToken(String token) {
        try {
            if (token == null) {
                throw new CustomException(LOGIN_REQUIRED);
            } else if (isTokenExpired(token)) {
                throw new CustomException(TOKEN_EXPIRED);
            }
            return;
        } catch (SecurityException | MalformedJwtException e) {
            log.warn("Invalid JWT signature: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("Unsupported JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT claims string is empty: {}", e.getMessage());
        }
        throw new CustomException(LOGIN_REQUIRED);
    }

    public void validateTokenIgnoringExpiration(String token) {
        try {
            if (token == null) {
                throw new CustomException(LOGIN_REQUIRED);
            }
            parseClaims(token);
            return;
        } catch (SecurityException | MalformedJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
        }
        throw new CustomException(LOGIN_REQUIRED);
    }

    private Claims parseClaims(String token) {
        try {
            return jwtParser.parseClaimsJws(token).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    private String createJwtToken(@NotNull String email, @Nullable Long userId, @NotNull Duration expirationDuration) {
        var now = Instant.now();
        var expiration = now.plus(expirationDuration);

        var builder = Jwts.builder()
                .setSubject(email)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiration))
                .signWith(key, SignatureAlgorithm.HS256);

        if (userId != null) {
            builder.claim("userId", userId);
        }

        return builder.compact();
    }
}
