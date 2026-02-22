package com.shyashyashya.refit.global.auth.model;

import java.time.Instant;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder(access = AccessLevel.PRIVATE)
public class RefreshToken {

    private String token;

    private String email;

    private Instant expiryDate;

    public static RefreshToken create(String token, String email, Instant expiryDate) {
        return RefreshToken.builder()
                .token(token)
                .email(email)
                .expiryDate(expiryDate)
                .build();
    }
}
