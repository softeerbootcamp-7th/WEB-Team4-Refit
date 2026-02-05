package com.shyashyashya.refit.domain.user.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.INDUSTRY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.JOB_CATEGORY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.USER_SIGNUP_EMAIL_CONFLICT;

import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.domain.user.dto.request.UserSignUpRequest;
import com.shyashyashya.refit.domain.user.dto.response.MyProfileResponse;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.domain.user.service.validator.UserSignUpValidator;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final IndustryRepository industryRepository;
    private final JobCategoryRepository jobCategoryRepository;

    private final UserSignUpValidator userSignUpValidator;
    private final RequestUserContext requestUserContext;

    @Transactional
    public void signUp(UserSignUpRequest userSignUpRequest) {
        var industry = industryRepository
                .findById(userSignUpRequest.industryId())
                .orElseThrow(() -> new CustomException(INDUSTRY_NOT_FOUND));

        var jobCategory = jobCategoryRepository
                .findById(userSignUpRequest.jobCategoryId())
                .orElseThrow(() -> new CustomException(JOB_CATEGORY_NOT_FOUND));

        userSignUpValidator.validateEmailConflict(userSignUpRequest.email());

        var user = User.create(
                userSignUpRequest.email(),
                userSignUpRequest.nickname(),
                userSignUpRequest.profileImageUrl(),
                false,
                industry,
                jobCategory);

        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new CustomException(USER_SIGNUP_EMAIL_CONFLICT);
        }
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
}
