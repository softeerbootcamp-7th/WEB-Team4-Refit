package com.shyashyashya.refit.global.auth.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.LOGIN_REQUIRED;

import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
import com.shyashyashya.refit.global.auth.model.RefreshToken;
import com.shyashyashya.refit.global.auth.repository.RefreshTokenRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.RefreshTokenTheftException;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    private final EntityManager entityManager;

    @Transactional
    public Optional<TokenPairDto> reissue(String accessToken, String refreshToken) {

        // 토큰이 없거나 서명이 불일치하는 경우 새로 발급 필요(로그인 유도)
        jwtUtil.validateTokenIgnoringExpiration(accessToken);
        jwtUtil.validateTokenIgnoringExpiration(refreshToken);

        // 리프레시 토큰이 만료되었으면 로그인 필요
        if (jwtUtil.isTokenExpired(refreshToken)) {
            refreshTokenRepository.deleteByToken(refreshToken);
            throw new CustomException(LOGIN_REQUIRED);
        }
        // 액세스 토큰이 만료되지 않았으면 재발급 불필요
        if (!jwtUtil.isTokenExpired(accessToken)) {
            return Optional.empty();
        }

        String email = jwtUtil.getEmail(refreshToken);
        Long userId = jwtUtil.getUserId(accessToken);

        // 리프레시 토큰이 저장소에 없으면 탈취 의심, 재로그인 필요
        RefreshToken storedToken = refreshTokenRepository
                .findByToken(refreshToken)
                .orElseThrow(() -> {
                    refreshTokenRepository.deleteByEmail(email);
                    return new RefreshTokenTheftException();
                });

        // 리프레시 토큰을 신뢰, Refresh Token Rotate 및 Access Token 재발급
        String newAccessToken = jwtUtil.createAccessToken(email, userId);
        String newRefreshToken = jwtUtil.createRefreshToken(email);
        Instant newExpiryDate = jwtUtil.getExpiration(newRefreshToken);

        storedToken.rotate(newRefreshToken, newExpiryDate);

        try {
            refreshTokenRepository.saveAndFlush(storedToken);
            return Optional.of(TokenPairDto.of(newAccessToken, newRefreshToken));

        } catch (ObjectOptimisticLockingFailureException e) {
            // 동시성 문제 발생 시, 승자의 리프레시 토큰을 찾아 반환, AccessToken은 새로 발급
            entityManager.clear();
            RefreshToken winnerToken = refreshTokenRepository
                    .findById(storedToken.getId())
                    .orElseThrow(() -> new CustomException(LOGIN_REQUIRED));

            String recoveryAccessToken = jwtUtil.createAccessToken(email, userId);
            return Optional.of(TokenPairDto.of(recoveryAccessToken, winnerToken.getToken()));
        }
    }
}
