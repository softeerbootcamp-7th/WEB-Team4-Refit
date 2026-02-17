package com.shyashyashya.refit.domain.interview.dto.response;

import jakarta.validation.constraints.NotNull;

public record PresignedUrlDto(
        @NotNull String url, @NotNull String key, @NotNull Integer expireSeconds) {

    public static PresignedUrlDto of(String url, String key, Integer expireSeconds) {
        return new PresignedUrlDto(url, key, expireSeconds);
    }
}
