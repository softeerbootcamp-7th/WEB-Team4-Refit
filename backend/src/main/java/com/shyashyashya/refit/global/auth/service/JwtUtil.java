package com.shyashyashya.refit.global.auth.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.LOGIN_REQUIRED;
import static com.shyashyashya.refit.global.exception.ErrorCode.TOKEN_EXPIRED;

import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.property.AuthJwtProperty;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import java.security.Key;
import java.time.Duration;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class JwtUtil {

    private final Key key;
    private final Duration accessTokenExpiration;
    private final Duration refreshTokenExpiration;

    public JwtUtil(AuthJwtProperty authJwtProperty) {
        this.key = Keys.hmacShaKeyFor(authJwtProperty.secret().getBytes());
        this.accessTokenExpiration = authJwtProperty.tokenExpiration().accessToken();
        this.refreshTokenExpiration = authJwtProperty.tokenExpiration().refreshToken();
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

    public void validateToken(String token) {

        try {
            if (token != null) {
                Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
                return;
            }
        } catch (SecurityException | MalformedJwtException e) {
            log.warn("Invalid JWT signature: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("Unsupported JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT claims string is empty: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token: {}", e.getMessage());
            throw new CustomException(TOKEN_EXPIRED);
        }
        throw new CustomException(LOGIN_REQUIRED);
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }
}
