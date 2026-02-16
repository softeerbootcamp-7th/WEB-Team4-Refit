package com.shyashyashya.refit.global.auth.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.LOGIN_REQUIRED;

import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
import com.shyashyashya.refit.global.auth.dto.TokenReissueResultDto;
import com.shyashyashya.refit.global.auth.model.RefreshToken;
import com.shyashyashya.refit.global.auth.repository.RefreshTokenRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.RefreshTokenTheftException;
import com.shyashyashya.refit.global.property.AuthJwtProperty;
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
public class JwtService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtEncoder jwtEncoder;
    private final AuthJwtProperty authJwtProperty;
    private final EntityManager entityManager;

    @Transactional
    public TokenPairDto publishTokenPair(@NotNull String email, @Nullable Long userId) {
        Instant issuedAt = Instant.now();
        String accessToken = jwtEncoder.encodeAccessJwt(email, userId, issuedAt);
        String refreshToken = jwtEncoder.encodeRefreshJwt(email, userId, issuedAt);

        Instant refreshTokenExpiration =
                issuedAt.plus(authJwtProperty.tokenExpiration().refreshToken());
        refreshTokenRepository.save(RefreshToken.create(refreshToken, email, refreshTokenExpiration));

        return TokenPairDto.of(accessToken, refreshToken);
    }

    @Transactional
    public TokenReissueResultDto rotateRefreshToken(
            @NotNull String encodedRefreshJwt, @NotNull String email, @Nullable Long userId) {
        // 리프레시 토큰이 저장소에 없으면 탈취 의심, 재로그인 필요
        // TODO: 서버가 리프레시토큰 테이블을 주기적으로 만료된 것들을 청소한다고 할때, 아래 경우를 고려해야 됨
        // TODO: n개의 기기를 가진 사용자가 그 중 1개의 기기에서 RT가 만료된다면? 이미 서버에 의해 삭제된 RT를 사용자가 보내는 경우인데
        // TODO: 이것을 과연 '탈취'라고 말할 수 있을까? 이런 경우를 구분한다면 어떻게 해야할까
        RefreshToken storedToken = refreshTokenRepository
                .findByToken(encodedRefreshJwt)
                .orElseThrow(() -> {
                    refreshTokenRepository.deleteByEmail(email);
                    return new RefreshTokenTheftException();
                });

        // 리프레시 토큰을 신뢰, RT Rotation 및 AT, RT 재발급
        Instant issuedAt = Instant.now();
        String newAccessToken = jwtEncoder.encodeAccessJwt(email, userId, issuedAt);
        String newRefreshToken = jwtEncoder.encodeRefreshJwt(email, userId, issuedAt);

        Instant refreshTokenExpiration =
                issuedAt.plus(authJwtProperty.tokenExpiration().refreshToken());
        storedToken.rotate(newRefreshToken, refreshTokenExpiration);

        try {
            refreshTokenRepository.saveAndFlush(storedToken);
            return TokenReissueResultDto.createReissueProcessed(userId, newAccessToken, newRefreshToken);

        } catch (ObjectOptimisticLockingFailureException e) {
            // 동시성 문제 발생 시, 승자의 리프레시 토큰을 찾아 반환
            entityManager.clear();
            RefreshToken winnerToken = refreshTokenRepository
                    .findById(storedToken.getId())
                    .orElseThrow(() -> new CustomException(LOGIN_REQUIRED));

            return TokenReissueResultDto.createReissueProcessed(userId, newAccessToken, winnerToken.getToken());
        }
    }
}
