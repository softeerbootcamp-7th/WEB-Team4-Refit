package com.shyashyashya.refit.global.config;

import static com.shyashyashya.refit.global.constant.AppConstant.DEV;
import static com.shyashyashya.refit.global.constant.UrlConstant.DEV_SERVER_URL;
import static com.shyashyashya.refit.global.constant.UrlConstant.LOCAL_SERVER_URL;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Value("${spring.profiles.active}")
    private String currentProfile;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().servers(getServers());
    }

    private List<Server> getServers() {
        String url = getUrl(currentProfile);
        Server server = new Server().url(url);
        return List.of(server);
    }

    private String getUrl(String profile) {
        return switch (profile) {
            case DEV -> DEV_SERVER_URL;
            default -> LOCAL_SERVER_URL;
        };
    }
}
