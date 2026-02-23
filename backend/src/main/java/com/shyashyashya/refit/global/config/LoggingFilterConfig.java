package com.shyashyashya.refit.global.config;

import com.shyashyashya.refit.global.filter.ApiLoggingFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Configuration
@RequiredArgsConstructor
public class LoggingFilterConfig {

    private final HandlerExceptionResolver handlerExceptionResolver;

    @Bean
    public FilterRegistrationBean<ApiLoggingFilter> loggingFilter() {
        FilterRegistrationBean<ApiLoggingFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new ApiLoggingFilter(handlerExceptionResolver));
        registrationBean.addUrlPatterns("/*");
        registrationBean.setOrder(org.springframework.core.Ordered.HIGHEST_PRECEDENCE + 1); // CORS 다음, 인증/보안 필터 전에 실행
        return registrationBean;
    }
}
