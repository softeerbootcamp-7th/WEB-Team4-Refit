package com.shyashyashya.refit.global.property;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "spring.s3.folder-names")
@Validated
public record S3FolderNameProperty(@NotBlank String interviewPdf) {}
