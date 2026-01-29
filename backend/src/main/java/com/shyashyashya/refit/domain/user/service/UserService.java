package com.shyashyashya.refit.domain.user.service;

import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.domain.user.dto.request.UserSignUpRequest;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.domain.user.service.validator.UserSignupConflictValidator;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final IndustryRepository industryRepository;
    private final JobCategoryRepository jobCategoryRepository;
    private final UserSignupConflictValidator userSignupConflictValidator;

    @Transactional
    public Long signUp(UserSignUpRequest userSignUpRequest) {
        var industry = industryRepository
                .findById(userSignUpRequest.industryId())
                .orElseThrow(() -> new CustomException(ErrorCode.INDUSTRY_ID_NOT_FOUND));

        var jobCategory = jobCategoryRepository
                .findById(userSignUpRequest.jobCategoryId())
                .orElseThrow(() -> new CustomException(ErrorCode.JOB_CATEGORY_ID_NOT_FOUND));

        userSignupConflictValidator.validateEmailConflict(userSignUpRequest.email());

        return userRepository
                .save(User.create(
                        userSignUpRequest.email(),
                        userSignUpRequest.nickname(),
                        userSignUpRequest.profileImageUrl(),
                        true,
                        industry,
                        jobCategory))
                .getId();
    }
}
