package com.shyashyashya.refit.domain.user.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.INDUSTRY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.JOB_CATEGORY_NOT_FOUND;

import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.domain.user.dto.request.MyProfileUpdateRequest;
import com.shyashyashya.refit.domain.user.dto.request.UserSignUpRequest;
import com.shyashyashya.refit.domain.user.dto.response.MyProfileResponse;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.domain.user.service.validator.UserValidator;
import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
import com.shyashyashya.refit.global.auth.service.JwtUtil;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final IndustryRepository industryRepository;
    private final JobCategoryRepository jobCategoryRepository;

    private final UserValidator userValidator;
    private final RequestUserContext requestUserContext;
    private final JwtUtil jwtUtil;

    @Transactional
    public TokenPairDto signUp(UserSignUpRequest userSignUpRequest) {
        var industry = industryRepository
                .findById(userSignUpRequest.industryId())
                .orElseThrow(() -> new CustomException(INDUSTRY_NOT_FOUND));

        var jobCategory = jobCategoryRepository
                .findById(userSignUpRequest.jobCategoryId())
                .orElseThrow(() -> new CustomException(JOB_CATEGORY_NOT_FOUND));

        userValidator.validateEmailNotConflict(requestUserContext.getEmail());

        var user = User.create(
                requestUserContext.getEmail(),
                userSignUpRequest.nickname(),
                userSignUpRequest.profileImageUrl(),
                false,
                industry,
                jobCategory);

        userRepository.save(user);

        String accessToken = jwtUtil.createAccessToken(user.getEmail(), user.getId());
        String refreshToken = jwtUtil.createRefreshToken(user.getEmail(), user.getId());

        return new TokenPairDto(accessToken, refreshToken);
    }

    @Transactional
    public void agreeToTerms() {
        User user = requestUserContext.getRequestUser();
        user.agreeToTerms();
    }

    @Transactional(readOnly = true)
    public MyProfileResponse getMyProfileInfo() {
        User user = requestUserContext.getRequestUser();
        return MyProfileResponse.from(user);
    }

    @Transactional
    public void updateMyProfile(MyProfileUpdateRequest myProfileUpdateRequest) {
        User user = requestUserContext.getRequestUser();

        Industry industry = industryRepository
                .findById(myProfileUpdateRequest.industryId())
                .orElseThrow(() -> new CustomException(INDUSTRY_NOT_FOUND));

        JobCategory jobCategory = jobCategoryRepository
                .findById(myProfileUpdateRequest.jobCategoryId())
                .orElseThrow(() -> new CustomException(JOB_CATEGORY_NOT_FOUND));

        userValidator.validateNicknameNotConflict(myProfileUpdateRequest.nickname());
        user.updateMyPage(myProfileUpdateRequest.nickname(), industry, jobCategory);
    }
}
