package com.shyashyashya.refit.domain.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MyPageUpdateRequest(
        @NotBlank @Size(max = 30) String nickname,
        @NotNull Long industryId,
        @NotNull Long jobCategoryId) {}
