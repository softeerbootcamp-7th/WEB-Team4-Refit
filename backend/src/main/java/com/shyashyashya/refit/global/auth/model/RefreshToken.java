package com.shyashyashya.refit.global.auth.model;

import com.shyashyashya.refit.global.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.Instant;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "refresh_tokens")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refresh_token_id")
    private Long id;

    @Version
    private Long version;

    @Column(name = "refresh_token", nullable = false, unique = true, columnDefinition = "varchar(2048)")
    private String token;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Instant expiryDate;

    @Builder(access = AccessLevel.PRIVATE)
    public RefreshToken(String token, String email, Instant expiryDate) {
        this.token = token;
        this.email = email;
        this.expiryDate = expiryDate;
    }

    public void rotate(String newRefreshToken, Instant newExpiryDate) {
        this.token = newRefreshToken;
        this.expiryDate = newExpiryDate;
    }

    public static RefreshToken create(String token, String email, Instant expiryDate) {
        return RefreshToken.builder()
                .token(token)
                .email(email)
                .expiryDate(expiryDate)
                .build();
    }
}
