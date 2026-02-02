package com.shyashyashya.refit.global.property;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "spring.auth.oauth2")
@Validated
public record OAuth2Property(@Valid @NotNull Google google) {
    public record Google(
            @NotBlank String clientId,
            @NotBlank String clientSecret,
            @NotBlank String redirectUri,
            @NotNull List<@NotBlank String> scope) {}
}
