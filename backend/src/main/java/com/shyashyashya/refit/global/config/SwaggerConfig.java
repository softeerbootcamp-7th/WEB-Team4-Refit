package com.shyashyashya.refit.global.config;

import static com.shyashyashya.refit.global.constant.AppConstant.DEV;
import static com.shyashyashya.refit.global.constant.UrlConstant.DEV_SERVER_URL;
import static com.shyashyashya.refit.global.constant.UrlConstant.LOCAL_SERVER_URL;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import java.util.List;
import org.springdoc.core.customizers.OpenApiCustomizer;
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

    @Bean
    public OpenApiCustomizer openApiCustomizer() {
        return openApi -> {
            List<Tag> sortedTags = openApi.getTags().stream()
                    .sorted((tag1, tag2) -> {
                        String name1 = tag1.getName();
                        String name2 = tag2.getName();

                        if (name1.contains("Test")) {
                            if (name2.contains("Test")) {
                                return name1.compareTo(name2);
                            }
                            return -1;
                        }
                        if (name2.contains("Test")) {
                            return 1;
                        }
                        return name1.compareTo(name2);
                    })
                    .toList();

            openApi.setTags(sortedTags);
        };
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
