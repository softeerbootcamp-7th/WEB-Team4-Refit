package com.shyashyashya.refit.global.auth.repository;

import com.shyashyashya.refit.global.auth.constant.RedisConstant;
import com.shyashyashya.refit.global.auth.model.RefreshToken;
import java.time.Duration;
import java.time.Instant;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RefreshTokenRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    public void save(RefreshToken refreshToken) {
        String tokenKey = RedisConstant.REFRESH_TOKEN_PREFIX + refreshToken.getToken();
        String emailKey = RedisConstant.REFRESH_TOKEN_EMAIL_PREFIX + refreshToken.getEmail();

        long ttlSeconds =
                Duration.between(Instant.now(), refreshToken.getExpiryDate()).getSeconds();
        if (ttlSeconds <= 0) {
            return;
        }

        // 토큰 객체 저장 및 TTL 설정
        redisTemplate.opsForValue().set(tokenKey, refreshToken, Duration.ofSeconds(ttlSeconds));

        // 이메일 기반 일괄 삭제를 위해 Set 에 토큰 문자열을 추가하고 만료 설정
        redisTemplate.opsForSet().add(emailKey, refreshToken.getToken());
        redisTemplate.expire(emailKey, Duration.ofSeconds(ttlSeconds));
    }

    public boolean existsByToken(String token) {
        return redisTemplate.hasKey(RedisConstant.REFRESH_TOKEN_PREFIX + token);
    }

    public void deleteByEmail(String email) {
        String emailKey = RedisConstant.REFRESH_TOKEN_EMAIL_PREFIX + email;
        Set<Object> tokens = redisTemplate.opsForSet().members(emailKey);

        if (tokens != null && !tokens.isEmpty()) {
            tokens.forEach(t -> redisTemplate.delete(RedisConstant.REFRESH_TOKEN_PREFIX + t.toString()));
        }
        redisTemplate.delete(emailKey);
    }

    public void deleteByTokenAndEmail(String token, String email) {
        String emailKey = RedisConstant.REFRESH_TOKEN_EMAIL_PREFIX + email;
        redisTemplate.opsForSet().remove(emailKey, token);
        redisTemplate.delete(RedisConstant.REFRESH_TOKEN_PREFIX + token);
    }

    /**
     * 이메일 정보를 모르는 경우(예: 단순 쿠키 삭제용 API) 메인 키만 삭제
     * 이메일 Set의 파편은 TTL 만료 시 자동 정리됨
     */
    public void deleteByToken(String token) {
        redisTemplate.delete(RedisConstant.REFRESH_TOKEN_PREFIX + token);
    }
}
