package com.shyashyashya.refit.domain.user.service.validator;

import static com.shyashyashya.refit.global.exception.ErrorCode.USER_NICKNAME_CONFLICT;
import static com.shyashyashya.refit.global.exception.ErrorCode.USER_SIGNUP_EMAIL_CONFLICT;

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

    public void validateNicknameNotConflict(@NonNull String nickname) {
        if (userRepository.existsByNickname(nickname)) {
            throw new CustomException(USER_NICKNAME_CONFLICT);
        }
    }
}
