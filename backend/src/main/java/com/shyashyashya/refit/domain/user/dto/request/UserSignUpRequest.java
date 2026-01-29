package com.shyashyashya.refit.domain.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserSignUpRequest(
        @Email @NotBlank @Size(max = 255) String email,
        @NotBlank @Size(max = 30) String nickname,
        @NotBlank @Size(max = 2048) String profileImageUrl,
        @NotNull Long industryId,
        @NotNull Long jobCategoryId) {}
