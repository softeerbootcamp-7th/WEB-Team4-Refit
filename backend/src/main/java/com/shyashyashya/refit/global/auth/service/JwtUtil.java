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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class JwtUtil {

    private final Key key;
    private final Duration accessTokenExpiration;
    private final Duration refreshTokenExpiration;
    private final JwtParser jwtParser;

    public JwtUtil(AuthJwtProperty authJwtProperty) {
        this.key = Keys.hmacShaKeyFor(authJwtProperty.secret().getBytes());
        this.accessTokenExpiration = authJwtProperty.tokenExpiration().accessToken();
        this.refreshTokenExpiration = authJwtProperty.tokenExpiration().refreshToken();
        this.jwtParser = Jwts.parserBuilder()
                .setSigningKey(key)
                .build();
    }

    public String createAccessToken(@NotNull String email, @Nullable Long userId) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + accessTokenExpiration.toMillis());

        var builder = Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(key, SignatureAlgorithm.HS256);

        if (userId != null) {
            builder.claim("userId", userId);
        }

        return builder.compact();
    }

    public String createRefreshToken(@NotNull String email) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + refreshTokenExpiration.toMillis());

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public Long getUserId(String token) {
        return parseClaims(token).get("userId", Long.class);
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

    public boolean isSignatureInvalid(String token) {
        try {
            if (token == null) {
                return true;
            }
            parseClaims(token);
            return false;
        } catch (SecurityException | MalformedJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
        }
        return true;
    }

    private Claims parseClaims(String token) {
        try {
            return jwtParser.parseClaimsJws(token).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }
}
