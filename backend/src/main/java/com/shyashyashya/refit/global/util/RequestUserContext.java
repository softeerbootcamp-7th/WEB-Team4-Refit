package com.shyashyashya.refit.global.util;

import com.shyashyashya.refit.domain.user.model.User;
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

    @Setter
    private User user;

    public User getRequestUser() {
        if (user == null) {
            throw new IllegalStateException("RequestUserContext에 설정된 User가 없습니다.");
        }
        return user;
    }
}
