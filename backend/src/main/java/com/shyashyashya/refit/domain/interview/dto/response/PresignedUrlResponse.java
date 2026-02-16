package com.shyashyashya.refit.domain.interview.dto.response;

import jakarta.validation.constraints.NotNull;

public record PresignedUrlResponse(
        @NotNull String url, @NotNull String key, @NotNull Integer expireSeconds) {}
