package com.shyashyashya.refit.global.auth;

import static com.shyashyashya.refit.global.exception.ErrorCode.LOGIN_REQUIRED;

import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.property.AuthProperty;
import com.shyashyashya.refit.global.util.RequestUserContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    private final AuthProperty authProperty;
    private final RequestUserContext requestUserContext;
    private final HandlerExceptionResolver handlerExceptionResolver;

    // TODO: JwtUtil 구현 후 실제 jwt에서 userId 추출하기
    // private final JwtUtil jwtUtil;

    // whitelist 패턴 매칭하기 위해 사용
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

            // TODO: token null 체크는 추후 제대로 된 JwtUtil 구현 후 적용
            if (
            /* token == null || */ !validateToken(token)) {
                throw new CustomException(LOGIN_REQUIRED);
            }

            // TODO: JwtUtil 구현 후 실제 jwt에서 userId 추출하기
            // Long userId = jwtUtil.getUserIdFromToken(token);
            Long userId = 1L; // 임시 하드코딩

            requestUserContext.setUserId(userId);
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            handlerExceptionResolver.resolveException(request, response, null, e);
        }
    }

    private boolean isWhitelisted(HttpServletRequest request) {
        return authProperty.getWhitelistApiUrls().stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, request.getRequestURI()));
    }

    private boolean validateToken(String token) {
        return true; // TODO: JwtUtil 구현 후 실제 토큰 검증 로직 추가
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
