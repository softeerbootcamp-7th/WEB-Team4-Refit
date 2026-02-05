package com.shyashyashya.refit.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient WebClient(WebClient.Builder builder) {
        return builder.build();
    }
}
