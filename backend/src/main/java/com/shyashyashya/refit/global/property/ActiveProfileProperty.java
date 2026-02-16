package com.shyashyashya.refit.global.property;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "spring.profiles")
public record ActiveProfileProperty(@NotBlank String active) {}
