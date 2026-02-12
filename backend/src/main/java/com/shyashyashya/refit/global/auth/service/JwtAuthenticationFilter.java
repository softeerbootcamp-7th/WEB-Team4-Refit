package com.shyashyashya.refit.global.auth.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.USER_SIGNUP_REQUIRED;

import com.shyashyashya.refit.global.constant.AuthConstant;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.property.AuthUrlProperty;
import com.shyashyashya.refit.global.util.RequestUserContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.core.annotation.Order;
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
    private final JwtUtil jwtUtil;

    private static final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) {
        try {

            if (isWhitelisted(request)) {
                filterChain.doFilter(request, response);
                return;
            }
            String token = resolveToken(request);
            var validatedJwtToken = jwtUtil.getValidatedJwtToken(token);
            requestUserContext.setEmail(jwtUtil.getEmail(validatedJwtToken));
            jwtUtil.getUserId(validatedJwtToken)
                    .ifPresentOrElse(this::setRequestUserContext, () -> validateIllegalGuestRequest(request));

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            handlerExceptionResolver.resolveException(request, response, null, e);
        }
    }

    private boolean isWhitelisted(HttpServletRequest request) {
        return authUrlProperty.whitelists().stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, request.getRequestURI()));
    }

    private void validateIllegalGuestRequest(HttpServletRequest request) {
        if (!pathMatcher.match(authUrlProperty.signUp(), request.getRequestURI())) {
            throw new CustomException(USER_SIGNUP_REQUIRED);
        }
    }

    private void setRequestUserContext(Long userId) {
        requestUserContext.setUserId(userId);
    }

    // 쿠키에서 토큰 추출
    private String resolveToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }

        return Arrays.stream(cookies)
                .filter(cookie -> AuthConstant.ACCESS_TOKEN.equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
    }
}
