package com.shyashyashya.refit.global.util;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

// TODO: [논의사항] 패키지가 여기가 맞는지 검토 필요
@Component
@RequestScope // RequestScope를 사용하여 요청 당 하나의 인스턴스 생성
@Getter
@Setter
public class RequestUserContext {
    private Long userId;
}
