package com.shyashyashya.refit.global.auth.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.LOGIN_REQUIRED;

import com.shyashyashya.refit.global.auth.dto.TokenReissueResultDto;
import com.shyashyashya.refit.global.auth.model.RefreshToken;
import com.shyashyashya.refit.global.auth.model.DecodedJwt;
import com.shyashyashya.refit.global.auth.repository.RefreshTokenRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.RefreshTokenTheftException;
import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
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
    public TokenReissueResultDto reissue(
            @Nullable String accessTokenFromHeader, @Nullable String refreshTokenFromHeader) {

        // RT가 없거나, 서명이 불일치 하거나, 만료되었으면 재로그인 필요
        var validatedRefreshToken = getValidatedCurrentRefreshToken(refreshTokenFromHeader);

        String email = jwtUtil.getEmail(validatedRefreshToken);
        Long userId = jwtUtil.getUserId(validatedRefreshToken).orElse(null);

        // RT, AT 모두 유효하면 재발급 불필요
        if (isCurrentAccessTokenValid(accessTokenFromHeader)) {
            return TokenReissueResultDto.createReissueNotProcessed(
                    userId, accessTokenFromHeader, refreshTokenFromHeader);
        }

        // RT가 유효하고 AT가 없거나 만료되었으므로 reissue: AT, RT 모두 재발급
        return rotateRefreshToken(refreshTokenFromHeader, email, userId);
    }

    private TokenReissueResultDto rotateRefreshToken(
            @NotNull String currentRefreshToken, @NotNull String email, @Nullable Long userId) {
        // 리프레시 토큰이 저장소에 없으면 탈취 의심, 재로그인 필요
        // TODO: 서버가 리프레시토큰 테이블을 주기적으로 만료된 것들을 청소한다고 할때, 아래 경우를 고려해야 됨
        // TODO: n개의 기기를 가진 사용자가 그 중 1개의 기기에서 RT가 만료된다면? 이미 서버에 의해 삭제된 RT를 사용자가 보내는 경우인데
        // TODO: 이것을 과연 '탈취'라고 말할 수 있을까? 이런 경우를 구분한다면 어떻게 해야할까
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
            return TokenReissueResultDto.createReissueProcessed(userId, newAccessToken, newRefreshToken);

        } catch (ObjectOptimisticLockingFailureException e) {
            // 동시성 문제 발생 시, 승자의 리프레시 토큰을 찾아 반환, AccessToken은 새로 발급
            entityManager.clear();
            RefreshToken winnerToken = refreshTokenRepository
                    .findById(storedToken.getId())
                    .orElseThrow(() -> new CustomException(LOGIN_REQUIRED));

            String recoveryAccessToken = jwtUtil.createAccessToken(email, userId);
            return TokenReissueResultDto.createReissueProcessed(userId, recoveryAccessToken, winnerToken.getToken());
        }
    }

    private boolean isCurrentAccessTokenValid(@Nullable String accessTokenFromHeader) {
        // 토큰이 있는데 토큰 서명이 불일치하면 로그인 필요
        if (accessTokenFromHeader == null || accessTokenFromHeader.isBlank()) {
            return false;
        }
        return !jwtUtil.getValidatedJwtTokenAllowExpired(accessTokenFromHeader).isExpired();
    }

    private DecodedJwt getValidatedCurrentRefreshToken(@Nullable String refreshTokenFromHeader) {
        // 토큰이 없거나, 토큰 서명이 불일치 하거나, 토큰이 만료되었으면 로그인 필요
        if (refreshTokenFromHeader == null || refreshTokenFromHeader.isBlank()) {
            throw new CustomException(LOGIN_REQUIRED);
        }
        return jwtUtil.getValidatedJwtToken(refreshTokenFromHeader);
    }
}
