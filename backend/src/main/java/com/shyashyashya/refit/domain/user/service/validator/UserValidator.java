package com.shyashyashya.refit.domain.user.service.validator;

import static com.shyashyashya.refit.global.exception.ErrorCode.USER_ALREADY_AGREED_TO_TERMS;
import static com.shyashyashya.refit.global.exception.ErrorCode.USER_SIGNUP_EMAIL_CONFLICT;

import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserValidator {

    private final UserRepository userRepository;

    public void validateEmailNotConflict(@NonNull String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new CustomException(USER_SIGNUP_EMAIL_CONFLICT);
        }
    }

    public void validateUserNotAgreedToTerms(User user) {
        if (user.isAgreedToTerms()) {
            throw new CustomException(USER_ALREADY_AGREED_TO_TERMS);
        }
    }
}
