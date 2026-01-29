package com.shyashyashya.refit.domain.user.service;

import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.ErrorCode;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserSignupConflictValidator {

    private final UserRepository userRepository;

    public void validateEmailConflict(@NonNull String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new CustomException(ErrorCode.USER_SIGNUP_EMAIL_CONFLICT);
        }
    }
}
