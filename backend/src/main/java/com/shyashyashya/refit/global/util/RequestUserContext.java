package com.shyashyashya.refit.global.util;

import static com.shyashyashya.refit.global.exception.ErrorCode.USER_NOT_FOUND;

import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

// TODO: 패키지 위치 다시 생각해보기
@Component
@RequestScope
@RequiredArgsConstructor
@Slf4j
public class RequestUserContext {

    private final UserRepository userRepository;
    @Setter
    private String email;

    @Setter
    private Long userId;

    public String getEmail() {
        if (this.email == null) {
            log.error("RequestUserContext에 설정된 email이 없습니다.");
            throw new IllegalStateException("RequestUserContext에 설정된 email이 없습니다.");
        }
        return this.email;
    }

    public User getRequestUser() {
        if (userId == null) {
            log.error("RequestUserContext에 설정된 userId가 없습니다.");
            throw new IllegalStateException("RequestUserContext에 설정된 userId가 없습니다.");
        }
        return userRepository.findById(userId).orElseThrow(() -> new CustomException(USER_NOT_FOUND));
    }
}
