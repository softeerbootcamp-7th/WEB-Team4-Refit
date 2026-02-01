package com.shyashyashya.refit.global.property;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "spring.auth")
@Validated
public record AuthProperty(
        List<String> whitelistApiUrls,
        String signUpUrl,
        @Valid @NotNull Jwt jwt,
        @Valid @NotNull Google google) {

    public record Jwt(
            @NotBlank String secret, @Valid @NotNull TokenExpiration tokenExpiration) {
        public record TokenExpiration(
                @NotNull Duration accessToken, @NotNull Duration refreshToken) {}
    }

    public record Google(
            @NotBlank String clientId,
            @NotBlank String clientSecret,
            @NotBlank String redirectUri,
            List<String> scope) {}
}
