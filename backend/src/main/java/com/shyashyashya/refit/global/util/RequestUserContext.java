package com.shyashyashya.refit.global.util;

import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

// TODO: 패키지 위치 다시 생각해보기
@Component
@RequestScope
@Getter
@RequiredArgsConstructor
public class RequestUserContext {

    private final UserRepository userRepository;

    @Setter
    private Long userId;

    private User user;

    public User getRequestUser() {
        if (user == null && userId != null) {
            user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        }
        return user;
    }
}
