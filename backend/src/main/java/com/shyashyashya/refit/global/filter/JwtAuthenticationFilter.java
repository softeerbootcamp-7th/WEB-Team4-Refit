package com.shyashyashya.refit.global.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.global.exception.ErrorCode;
import com.shyashyashya.refit.global.property.AuthProperty;
import com.shyashyashya.refit.global.util.RequestUserContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
@RequiredArgsConstructor
@Order(1)
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final AuthProperty authProperty;
    private final RequestUserContext requestUserContext;
    private final ObjectMapper objectMapper;

    // TODO: JwtUtil 구현 후 실제 jwt에서 userId 추출하기
    // private final JwtUtil jwtUtil;

    // whitelist 패턴 매칭하기 위해 사용
    private static final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        if (isWhitelisted(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = resolveToken(request);

            if (token == null || !validateToken(token)) {
                var errorCode = ErrorCode.LOGIN_REQUIRED;
                handleFilterException(response, errorCode.getHttpStatus(), CommonResponse.customException(errorCode));
                return;
            }

            // TODO: JwtUtil 구현 후 실제 jwt에서 userId 추출하기
            // Long userId = jwtUtil.getUserIdFromToken(token);
            Long userId = 1L; // 임시 하드코딩

            requestUserContext.setUserId(userId);
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            handleFilterException(response, HttpStatus.INTERNAL_SERVER_ERROR, CommonResponse.unknownException(e));
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

    // filter 에서의 예외는 GlobalExceptionHandler로 처리되지 않으므로 직접 응답 작성
    private <T> void handleFilterException(HttpServletResponse response, HttpStatus status, CommonResponse<T> body)
            throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
