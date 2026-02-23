package com.shyashyashya.refit.global.auth.repository;

import com.shyashyashya.refit.global.auth.model.RefreshToken;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {

    void deleteByEmail(String email);
}
