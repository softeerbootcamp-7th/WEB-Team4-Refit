package com.shyashyashya.refit.global.auth.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.TOKEN_REISSUE_REQUIRED;

import com.shyashyashya.refit.global.auth.dto.TokenReissueResultDto;
import com.shyashyashya.refit.global.auth.model.DecodedJwt;
import com.shyashyashya.refit.global.auth.service.validator.JwtDecoder;
import com.shyashyashya.refit.global.auth.service.validator.JwtValidator;
import com.shyashyashya.refit.global.exception.CustomException;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtDecoder jwtDecoder;
    private final JwtValidator jwtValidator;
    private final JwtService jwtService;

    public TokenReissueResultDto reissue(@Nullable String encodedAccessJwt, @Nullable String encodedRefreshJwt) {

        // RT가 없거나, 서명이 불일치 하거나, 만료되었으면 재로그인 필요
        DecodedJwt refreshToken = jwtDecoder.decodeRefreshJwt(encodedRefreshJwt);
        jwtValidator.validateRefreshJwtNotExpired(refreshToken);

        String email = jwtDecoder.getEmail(refreshToken);
        Long userId = jwtDecoder.getUserId(refreshToken);

        try {
            // RT는 유효하나, AT가 없거나 만료되면 catch로 빠져서 reissue 수행: RTR 후 AT, RT 모두 재발급
            DecodedJwt accessToken = jwtDecoder.decodeAccessJwt(encodedAccessJwt);
            jwtValidator.validateAccessJwtNotExpired(accessToken);

            // RT, AT 모두 유효하면 재발급 불필요
            return TokenReissueResultDto.createReissueNotProcessed(userId, encodedAccessJwt, encodedRefreshJwt);

        } catch (CustomException e) {
            if (e.getErrorCode() == TOKEN_REISSUE_REQUIRED) {
                return jwtService.rotateRefreshToken(encodedRefreshJwt, email, userId);
            }

            // 그 외의 예외는 상위로 던짐
            throw e;
        }
    }
}
