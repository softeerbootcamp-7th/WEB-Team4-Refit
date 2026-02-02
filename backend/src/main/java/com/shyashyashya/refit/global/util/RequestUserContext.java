package com.shyashyashya.refit.global.util;

import static com.shyashyashya.refit.global.exception.ErrorCode.USER_NOT_FOUND;

import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

// TODO: 패키지 위치 다시 생각해보기
@Component
@RequestScope
@RequiredArgsConstructor
public class RequestUserContext {

    private final UserRepository userRepository;

    @Getter
    @Setter
    private Long userId;

    @Getter
    @Setter
    private String email;

    private User user;

    public User getRequestUser() {
        if (user == null && userId != null) {
            user = userRepository.findById(userId).orElseThrow(() -> new CustomException(USER_NOT_FOUND));
        }
        return user;
    }
}
