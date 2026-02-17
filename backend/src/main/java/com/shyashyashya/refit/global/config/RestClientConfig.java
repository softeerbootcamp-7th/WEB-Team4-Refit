package com.shyashyashya.refit.global.config;

import com.shyashyashya.refit.domain.interview.constant.QnaSetGenerationConstant;
import java.net.http.HttpClient;
import java.time.Duration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    @Primary
    public RestClient restClient() {
        return RestClient.builder().build();
    }

    @Bean(name = "geminiApiRestClient")
    public RestClient geminiApiRestClient() {
        Duration connectTimeout = Duration.ofSeconds(QnaSetGenerationConstant.GEMINI_CONNECT_TIMEOUT_SEC);
        Duration readTimeout = Duration.ofSeconds(QnaSetGenerationConstant.GEMINI_READ_TIMEOUT_SEC);

        HttpClient httpClient =
                HttpClient.newBuilder().connectTimeout(connectTimeout).build();

        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(readTimeout);

        return RestClient.builder().requestFactory(requestFactory).build();
    }
}
