package com.shyashyashya.refit.global.property;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "spring.s3")
@Validated
public record S3Property(@NotBlank String region, @NotBlank String bucket, int presignExpireSeconds) {}
