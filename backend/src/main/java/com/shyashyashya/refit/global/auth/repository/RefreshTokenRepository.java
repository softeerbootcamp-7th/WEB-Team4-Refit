package com.shyashyashya.refit.global.auth.repository;

import com.shyashyashya.refit.global.auth.model.RefreshToken;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {

    Optional<RefreshToken> findByEmail(String email);

    void deleteByEmail(String email);
}
