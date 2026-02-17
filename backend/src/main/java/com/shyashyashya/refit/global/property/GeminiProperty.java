package com.shyashyashya.refit.global.property;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "spring.gemini")
@Validated
public record GeminiProperty(
        @NotBlank String apiKey,
        @NotBlank String promptPath,
        @NotNull Long restClientConnectTimeoutSec,
        @NotNull Long restClientReadTimeoutSec,
        @NotNull Long webClientRequestTimeoutSec) {}
