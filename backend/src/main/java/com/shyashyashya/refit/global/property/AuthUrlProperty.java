package com.shyashyashya.refit.global.property;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "spring.auth.url")
@Validated
public record AuthUrlProperty(
        @NotNull List<@NotBlank String> whitelists, @NotNull String signUp) {}
