package com.shyashyashya.refit.global.property;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "spring.gemini")
@Validated
public record GeminiProperty(
        @NotBlank String apiKey, @NotBlank String promptPath) {}
