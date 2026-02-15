package com.shyashyashya.refit.domain.interview.dto.response;

import jakarta.validation.constraints.NotNull;

public record PdfUploadUrlResponse(@NotNull String url, @NotNull String key) {}
