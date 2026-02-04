package com.shyashyashya.refit.global.config;

import static com.shyashyashya.refit.global.constant.UrlConstant.DEV_CLIENT_URL;
import static com.shyashyashya.refit.global.constant.UrlConstant.LOCAL_CLIENT_URL;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(LOCAL_CLIENT_URL, DEV_CLIENT_URL)
                .allowedMethods(HttpMethod.GET.name(),
                        HttpMethod.POST.name(),
                        HttpMethod.PUT.name(),
                        HttpMethod.DELETE.name(),
                        HttpMethod.OPTIONS.name())
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
