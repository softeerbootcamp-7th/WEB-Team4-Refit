package com.shyashyashya.refit.domain.user.service.validator;

import static com.shyashyashya.refit.global.exception.ErrorCode.USER_SIGNUP_EMAIL_CONFLICT;

import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserExistenceValidator {

    private final UserRepository userRepository;

    public void validateUserExists(Long userId) {
        if (userRepository.findById(userId).isEmpty()) {
            throw new CustomException(USER_SIGNUP_EMAIL_CONFLICT);
        }
    }
}
