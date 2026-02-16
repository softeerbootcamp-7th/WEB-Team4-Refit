package com.shyashyashya.refit.global.property;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "spring.auth.jwt")
@Validated
public record AuthJwtProperty(
        @NotBlank String secret, @Valid @NotNull TokenExpiration tokenExpiration) {

    public record TokenExpiration(
            @NotNull Duration accessToken, @NotNull Duration refreshToken) {}
}
