package com.shyashyashya.refit.domain.user.service;

import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.domain.user.dto.request.UserSignUpRequest;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.domain.user.service.validator.UserSignUpValidator;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.ErrorCode;
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

    @Transactional
    public void signUp(UserSignUpRequest userSignUpRequest) {
        var industry = industryRepository
                .findById(userSignUpRequest.industryId())
                .orElseThrow(() -> new CustomException(ErrorCode.INDUSTRY_NOT_FOUND));

        var jobCategory = jobCategoryRepository
                .findById(userSignUpRequest.jobCategoryId())
                .orElseThrow(() -> new CustomException(ErrorCode.JOB_CATEGORY_NOT_FOUND));

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
            throw new CustomException(ErrorCode.USER_SIGNUP_EMAIL_CONFLICT);
        }
    }
}
