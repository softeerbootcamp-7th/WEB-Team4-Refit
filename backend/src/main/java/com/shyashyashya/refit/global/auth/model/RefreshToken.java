package com.shyashyashya.refit.global.auth.model;

import java.time.Duration;
import java.time.Instant;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@Builder(access = AccessLevel.PRIVATE)
@RedisHash(value = "RT")
public class RefreshToken {

    @Id
    private String token;

    @Indexed
    private String email;

    private Instant expiryDate;

    public static RefreshToken create(String token, String email, Instant expiryDate) {
        return RefreshToken.builder()
                .token(token)
                .email(email)
                .expiryDate(expiryDate)
                .build();
    }

    @TimeToLive
    public long getTimeToLive(Instant now) {
        return Math.max(0, Duration.between(now, expiryDate).getSeconds());
    }
}
