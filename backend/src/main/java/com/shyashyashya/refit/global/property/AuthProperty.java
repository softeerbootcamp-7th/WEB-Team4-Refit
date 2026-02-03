package com.shyashyashya.refit.global.property;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "spring.auth")
@Validated
public record AuthProperty(boolean usingHttps) {}
