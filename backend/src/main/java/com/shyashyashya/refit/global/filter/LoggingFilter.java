package com.shyashyashya.refit.global.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.slf4j.MDC;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@RequiredArgsConstructor
public class LoggingFilter extends OncePerRequestFilter {

    private static final String TRACE_ID = "traceId";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String uri = request.getRequestURI();
        if (isAsyncDispatch(request) || uri.startsWith("/swagger-ui") || uri.startsWith("/v3/api-docs")) {
            filterChain.doFilter(request, response);
            return;
        }

        String traceId = UUID.randomUUID().toString().substring(0, 8);
        MDC.put(TRACE_ID, traceId);

        String method = request.getMethod();
        String clientIp = getClientIp(request);
        String queryString = request.getQueryString();
        String decodedQueryString = "";
        if (queryString != null && !queryString.isEmpty()) {
            decodedQueryString = "?" + URLDecoder.decode(queryString, java.nio.charset.StandardCharsets.UTF_8);
        }
        String requestUriWithQuery = uri + decodedQueryString;

        log.info("[Request] {} {} (IP: {})", method, requestUriWithQuery, clientIp);
        long startTime = System.currentTimeMillis();

        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = response.getStatus();
            log.info("[Response] HTTP {} ({} {}) - {}ms", status, method, requestUriWithQuery, duration);
            MDC.clear();
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
