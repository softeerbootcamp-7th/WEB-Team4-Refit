package com.shyashyashya.refit.global.config;

import com.shyashyashya.refit.global.util.CurrentProfileUtil;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import java.util.List;
import org.springdoc.core.customizers.OpenApiCustomizer;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class SwaggerConfig {

    private final CurrentProfileUtil currentProfileUtil;

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
        String url = currentProfileUtil.getServerUrl();
        Server server = new Server().url(url);
        return List.of(server);
    }
}
