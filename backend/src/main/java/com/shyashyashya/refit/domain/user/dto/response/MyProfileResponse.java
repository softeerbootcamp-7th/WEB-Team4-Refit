package com.shyashyashya.refit.domain.user.dto.response;

import com.shyashyashya.refit.domain.user.model.User;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record MyProfileResponse(
        @NotNull String nickname,
        @NotNull Long industryId,
        @NotNull Long jobCategoryId,
        String profileImageUrl) {

    public static MyProfileResponse from(User user) {
        return MyProfileResponse.builder()
                .nickname(user.getNickname())
                .industryId(user.getIndustry().getId())
                .jobCategoryId(user.getJobCategory().getId())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }
}
