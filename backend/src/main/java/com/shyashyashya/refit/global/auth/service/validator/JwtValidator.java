package com.shyashyashya.refit.global.auth.service.validator;

import static com.shyashyashya.refit.global.exception.ErrorCode.LOGIN_REQUIRED;
import static com.shyashyashya.refit.global.exception.ErrorCode.OAUTH2_STATE_TOKEN_EXPIRED;
import static com.shyashyashya.refit.global.exception.ErrorCode.TOKEN_REISSUE_REQUIRED;

import com.shyashyashya.refit.global.auth.model.DecodedJwt;
import com.shyashyashya.refit.global.auth.model.DecodedJwtType;
import com.shyashyashya.refit.global.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JwtValidator {

    public void validateDecodedJwtTypeEquals(DecodedJwt decodedJwt, DecodedJwtType expectedType) {
        if (decodedJwt.type() != expectedType) {
            log.error("{} type expected.", expectedType);
            throw new IllegalArgumentException("validateDecodedJwtTypeEquals failed");
        }
    }

    public void validateJwtTypeEqualsAccessOrRefresh(DecodedJwt decodedJwt) {
        if (decodedJwt.type() != DecodedJwtType.ACCESS_TOKEN && decodedJwt.type() != DecodedJwtType.REFRESH_TOKEN) {
            log.error("ACCESS_TOKEN or REFRESH_TOKEN type expected.");
            throw new IllegalArgumentException("validateJwtTypeEqualsAccessOrRefresh failed");
        }
    }

    public void validateAccessJwtNotExpired(DecodedJwt accessJwt) {
        if (accessJwt.isExpired()) {
            throw new CustomException(TOKEN_REISSUE_REQUIRED);
        }
    }

    public void validateRefreshJwtNotExpired(DecodedJwt refreshJwt) {
        if (refreshJwt.isExpired()) {
            throw new CustomException(LOGIN_REQUIRED);
        }
    }

    public void validateOAuth2StateJwtNotExpired(DecodedJwt oAuth2StateJwt) {
        if (oAuth2StateJwt.isExpired()) {
            throw new CustomException(OAUTH2_STATE_TOKEN_EXPIRED);
        }
    }
}
