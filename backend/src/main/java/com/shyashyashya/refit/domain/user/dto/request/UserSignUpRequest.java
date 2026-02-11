package com.shyashyashya.refit.domain.user.dto.request;

import com.shyashyashya.refit.domain.user.constant.UserConstant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserSignUpRequest(
        @NotBlank @Size(max = UserConstant.USER_NICKNAME_MAX_LENGTH) String nickname,
        @NotBlank @Size(max = UserConstant.USER_PROFILE_IMAGE_URL_MAX_LENGTH) String profileImageUrl,
        @NotNull Long industryId,
        @NotNull Long jobCategoryId) {}
