package com.shyashyashya.refit.domain.user.service;

import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.domain.user.dto.request.UserSignUpDto;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.domain.user.service.validator.UserSignupConflictValidator;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final IndustryRepository industryRepository;
    private final JobCategoryRepository jobCategoryRepository;
    private final UserSignupConflictValidator userSignupConflictValidator;

    @Transactional
    public Long signUp(UserSignUpDto userSignUpDto) {
        var industry = industryRepository
                .findById(userSignUpDto.industryId())
                .orElseThrow(() -> new CustomException(ErrorCode.INDUSTRY_ID_NOT_FOUND));

        var jobCategory = jobCategoryRepository
                .findById(userSignUpDto.jobCategoryId())
                .orElseThrow(() -> new CustomException(ErrorCode.JOB_CATEGORY_ID_NOT_FOUND));

        userSignupConflictValidator.validateEmailConflict(userSignUpDto.email());

        return userRepository
                .save(User.create(
                        userSignUpDto.email(),
                        userSignUpDto.nickname(),
                        userSignUpDto.profileImageUrl(),
                        true,
                        industry,
                        jobCategory))
                .getId();
    }
}
