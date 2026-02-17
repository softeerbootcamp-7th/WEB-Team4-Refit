package com.shyashyashya.refit.global.config;

import com.shyashyashya.refit.global.property.GeminiProperty;
import java.net.http.HttpClient;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
@RequiredArgsConstructor
public class RestClientConfig {

    private final GeminiProperty geminiProperty;

    @Bean
    @Primary
    public RestClient restClient() {
        return RestClient.builder().build();
    }

    @Bean(name = "geminiApiRestClient")
    public RestClient geminiApiRestClient() {
        Duration connectTimeout = Duration.ofSeconds(geminiProperty.restClientConnectTimeoutSec());
        Duration readTimeout = Duration.ofSeconds(geminiProperty.restClientReadTimeoutSec());

        HttpClient httpClient =
                HttpClient.newBuilder().connectTimeout(connectTimeout).build();

        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(readTimeout);

        return RestClient.builder().requestFactory(requestFactory).build();
    }
}
