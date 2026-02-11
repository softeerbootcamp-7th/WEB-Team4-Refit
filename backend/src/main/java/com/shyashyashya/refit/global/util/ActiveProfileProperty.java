package com.shyashyashya.refit.global.util;

import com.shyashyashya.refit.global.model.ServerEnvironmentType;
import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "spring.profiles")
public record ActiveProfileProperty(@NotBlank String active) {

    public String getServerUrl() {
        return ServerEnvironmentType.fromString(active).getServerUrl();
    }
}
