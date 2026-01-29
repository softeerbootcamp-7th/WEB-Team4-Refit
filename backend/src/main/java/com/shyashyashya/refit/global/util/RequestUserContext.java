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

// TODO: [논의사항] 패키지가 여기가 맞는지 검토 필요
@Component
@RequestScope // RequestScope를 사용하여 요청 당 하나의 인스턴스 생성
@Getter
@Setter
@RequiredArgsConstructor
public class RequestUserContext {

    private final UserRepository userRepository;

    private Long userId;
    private User user;

    public User getRequestUser() {
        if (user == null && userId != null) {
            user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        }
        return user;
    }
}
