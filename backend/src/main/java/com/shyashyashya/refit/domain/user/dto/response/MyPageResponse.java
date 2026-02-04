package com.shyashyashya.refit.domain.user.dto.response;

import com.shyashyashya.refit.domain.user.model.User;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record MyPageResponse(String nickname, Long industryId, Long jobCategoryId, String profileImageUrl) {

    public static MyPageResponse from(User user) {
        return MyPageResponse.builder()
            .nickname(user.getNickname())
            .industryId(user.getIndustry().getId())
            .jobCategoryId(user.getJobCategory().getId())
            .profileImageUrl(user.getProfileImageUrl())
            .build();
    }
}
