package com.shyashyashya.refit.global.auth.repository;

import com.shyashyashya.refit.global.auth.model.RefreshToken;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByEmail(String email);

    Optional<RefreshToken> findByToken(String token);

    void deleteByEmail(String email);

    @Modifying
    void deleteByExpiryDateBefore(Instant expiryDateBefore);
}
