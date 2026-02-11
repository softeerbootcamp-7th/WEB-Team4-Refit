package com.shyashyashya.refit.global.auth.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.LOGIN_REQUIRED;

import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
import com.shyashyashya.refit.global.auth.model.RefreshToken;
import com.shyashyashya.refit.global.auth.model.ValidatedJwtToken;
import com.shyashyashya.refit.global.auth.repository.RefreshTokenRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.RefreshTokenTheftException;
import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import jakarta.validation.constraints.NotNull;
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

    // TODO: 추후 AccessToken이 없어도 발급 가능하도록 수정
    @Transactional
    public Optional<TokenPairDto> reissue(
            @Nullable String accessTokenFromHeader, @Nullable String refreshTokenFromHeader) {

        // RT가 없거나, 서명이 불일치 하거나, 만료되었으면 재로그인 필요
        var validatedRefreshToken = getValidatedCurrentRefreshToken(refreshTokenFromHeader);

        // AT가 있으면 서명 검증, 없으면 null 반환
        var NullableValidatedAccessToken = getValidatedCurrentAccessTokenAllowExpired(accessTokenFromHeader);

        // RT, AT 모두 유효하면 재발급 불필요
        // TODO: 정회원/게스트 여부도 반환 필요
        if (NullableValidatedAccessToken != null && !NullableValidatedAccessToken.isExpired()) {
            return Optional.of(TokenPairDto.of(accessTokenFromHeader, refreshTokenFromHeader));
        }

        // RT가 유효하고 AT가 없거나 만료되었으므로 reissue: AT, RT 모두 재발급
        String email = jwtUtil.getEmail(validatedRefreshToken);
        Long userId = jwtUtil.getUserId(validatedRefreshToken).orElse(null);
        return rotateRefreshToken(refreshTokenFromHeader, email, userId);
    }

    private Optional<TokenPairDto> rotateRefreshToken(
            @NotNull String currentRefreshToken, @NotNull String email, @Nullable Long userId) {
        // 리프레시 토큰이 저장소에 없으면 탈취 의심, 재로그인 필요
        RefreshToken storedToken = refreshTokenRepository
                .findByToken(currentRefreshToken)
                .orElseThrow(() -> {
                    refreshTokenRepository.deleteByEmail(email);
                    return new RefreshTokenTheftException();
                });

        // 리프레시 토큰을 신뢰, RT Rotation 및 AT, RT 재발급
        String newAccessToken = jwtUtil.createAccessToken(email, userId);
        String newRefreshToken = jwtUtil.createRefreshToken(email, userId);
        Instant newExpiryDate = jwtUtil.getValidatedJwtToken(newRefreshToken).getExpiration();
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

    private ValidatedJwtToken getValidatedCurrentAccessTokenAllowExpired(@Nullable String accessTokenFromHeader) {
        // 토큰이 있는데 토큰 서명이 불일치하면 로그인 필요
        if (accessTokenFromHeader == null || accessTokenFromHeader.isBlank()) {
            return null;
        }
        return jwtUtil.getValidatedJwtTokenAllowExpired(accessTokenFromHeader);
    }

    private ValidatedJwtToken getValidatedCurrentRefreshToken(@Nullable String refreshTokenFromHeader) {
        // 토큰이 없거나, 토큰 서명이 불일치 하거나, 토큰이 만료되었으면 로그인 필요
        if (refreshTokenFromHeader == null || refreshTokenFromHeader.isBlank()) {
            throw new CustomException(LOGIN_REQUIRED);
        }
        return jwtUtil.getValidatedJwtToken(refreshTokenFromHeader);
    }
}
