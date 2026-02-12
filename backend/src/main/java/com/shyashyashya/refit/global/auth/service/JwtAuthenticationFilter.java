package com.shyashyashya.refit.global.auth.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.USER_ALREADY_SIGNED_UP;
import static com.shyashyashya.refit.global.exception.ErrorCode.USER_SIGNUP_REQUIRED;

import com.shyashyashya.refit.global.auth.model.DecodedJwt;
import com.shyashyashya.refit.global.auth.service.validator.JwtValidator;
import com.shyashyashya.refit.global.constant.AuthConstant;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.property.AuthUrlProperty;
import com.shyashyashya.refit.global.util.CookieUtil;
import com.shyashyashya.refit.global.util.RequestUserContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Component
@Order(1)
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final AuthUrlProperty authUrlProperty;
    private final RequestUserContext requestUserContext;
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final JwtDecoder jwtDecoder;
    private final JwtValidator jwtValidator;
    private final CookieUtil cookieUtil;

    private static final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) {

        try {
            String encodedAccessJwt = cookieUtil.extractCookieValue(request, AuthConstant.ACCESS_TOKEN);
            String encodedRefreshJwt = cookieUtil.extractCookieValue(request, AuthConstant.REFRESH_TOKEN);

            // RT가 없거나, 서명이 불일치 하거나, 만료되었으면 로그인 필요
            DecodedJwt refreshToken = jwtDecoder.decodeRefreshJwt(encodedRefreshJwt);
            jwtValidator.validateRefreshJwtNotExpired(refreshToken);

            // RT는 유효하나 AT가 만료되었으면 reissue 필요
            DecodedJwt accessToken = jwtDecoder.decodeAccessJwt(encodedAccessJwt);
            jwtValidator.validateAccessJwtNotExpired(accessToken);

            Long userId = jwtDecoder.getUserId(accessToken);
            String email = jwtDecoder.getEmail(accessToken);

            requestUserContext.setEmail(email);
            requestUserContext.setUserId(userId);

            if (isGuestRequest(userId)) {
                validateGuestRequestNotIllegal(request);
                filterChain.doFilter(request, response);
                return;
            }

            validateUserRequestNotIllegal(request);
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            handlerExceptionResolver.resolveException(request, response, null, e);
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        return isWhitelisted(request);
    }

    private boolean isWhitelisted(HttpServletRequest request) {
        return authUrlProperty.whitelists().stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, request.getRequestURI()));
    }

    private void validateGuestRequestNotIllegal(HttpServletRequest request) {
        if (!isSignUpRequest(request)) {
            throw new CustomException(USER_SIGNUP_REQUIRED);
        }
    }

    private void validateUserRequestNotIllegal(HttpServletRequest request) {
        if (isSignUpRequest(request)) {
            throw new CustomException(USER_ALREADY_SIGNED_UP);
        }
    }

    private boolean isSignUpRequest(HttpServletRequest request) {
        return pathMatcher.match(authUrlProperty.signUp(), request.getRequestURI());
    }

    private boolean isGuestRequest(Long userId) {
        return userId == null;

    }
}
