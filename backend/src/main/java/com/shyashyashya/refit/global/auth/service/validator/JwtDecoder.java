package com.shyashyashya.refit.global.auth.service.validator;

import static com.shyashyashya.refit.global.exception.ErrorCode.LOGIN_REQUIRED;
import static com.shyashyashya.refit.global.exception.ErrorCode.OAUTH2_STATE_TOKEN_EXPIRED;
import static com.shyashyashya.refit.global.exception.ErrorCode.TOKEN_REISSUE_REQUIRED;

import com.shyashyashya.refit.global.auth.model.DecodedJwt;
import com.shyashyashya.refit.global.auth.model.DecodedJwtType;
import com.shyashyashya.refit.global.constant.AuthConstant;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.ErrorCode;
import com.shyashyashya.refit.global.property.AuthJwtProperty;
import com.shyashyashya.refit.global.util.ClientOriginType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.validation.constraints.NotNull;
import java.security.Key;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JwtDecoder {

    private final JwtParser jwtParser;
    private final JwtValidator jwtValidator;

    public JwtDecoder(AuthJwtProperty authJwtProperty, JwtValidator jwtValidator) {
        Key key = Keys.hmacShaKeyFor(authJwtProperty.secret().getBytes());
        this.jwtParser = Jwts.parserBuilder().setSigningKey(key).build();
        this.jwtValidator = jwtValidator;
    }

    public DecodedJwt decodeAccessJwt(@NotNull String encodedAccessJwt) {
        return decode(encodedAccessJwt, DecodedJwtType.ACCESS_TOKEN, TOKEN_REISSUE_REQUIRED);
    }

    public DecodedJwt decodeRefreshJwt(@NotNull String encodedRefreshJwt) {
        return decode(encodedRefreshJwt, DecodedJwtType.ACCESS_TOKEN, LOGIN_REQUIRED);
    }

    public DecodedJwt decodeOAuth2StateJwt(@NotNull String encodedOAuth2StateJwt) {
        return decode(encodedOAuth2StateJwt, DecodedJwtType.OAUTH2_STATE_TOKEN, OAUTH2_STATE_TOKEN_EXPIRED);
    }

    public ClientOriginType getClientOriginType(DecodedJwt decodedJwt) {
        jwtValidator.validateDecodedJwtTypeEquals(decodedJwt, DecodedJwtType.OAUTH2_STATE_TOKEN);
        return ClientOriginType.fromOriginString(decodedJwt.claims().getSubject());
    }

    public String getEmail(DecodedJwt decodedJwt) {
        jwtValidator.validateJwtTypeEqualsAccessOrRefresh(decodedJwt);
        return decodedJwt.claims().getSubject();
    }

    public Optional<Long> getUserId(DecodedJwt decodedJwt) {
        jwtValidator.validateJwtTypeEqualsAccessOrRefresh(decodedJwt);
        return Optional.ofNullable(decodedJwt.claims().get(AuthConstant.CLAIM_KEY_USER_ID, Long.class));
    }

    private DecodedJwt decode(@NotNull String encodedJwt, DecodedJwtType expectedType, ErrorCode toThrowErrorCode) {
        try {
            Claims claims = jwtParser.parseClaimsJws(encodedJwt).getBody();
            DecodedJwt decodedJwt = DecodedJwt.createUnexpired(claims);
            jwtValidator.validateDecodedJwtTypeEquals(decodedJwt, expectedType);
            return decodedJwt;

        } catch (ExpiredJwtException e) {
            Claims claims = e.getClaims();
            return DecodedJwt.createExpired(claims);

        } catch (JwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            throw new CustomException(toThrowErrorCode);
        }
    }
}
