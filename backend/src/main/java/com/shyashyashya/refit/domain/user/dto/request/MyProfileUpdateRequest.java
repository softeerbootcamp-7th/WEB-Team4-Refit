package com.shyashyashya.refit.domain.user.dto.request;

import com.shyashyashya.refit.domain.user.constant.UserConstant;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Size;

public record MyProfileUpdateRequest(
        @Nullable @Size(max = UserConstant.USER_NICKNAME_MAX_LENGTH) String nickname,

        @Nullable Long industryId,
        @Nullable Long jobCategoryId) {}
