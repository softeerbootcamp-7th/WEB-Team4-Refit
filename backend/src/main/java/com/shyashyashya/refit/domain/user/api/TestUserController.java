package com.shyashyashya.refit.domain.user.api;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON204;
import static com.shyashyashya.refit.global.exception.ErrorCode.USER_NOT_FOUND;

import com.shyashyashya.refit.global.dto.CommonResponse;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.auth.repository.RefreshTokenRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Test Auth/User API", description = "개발용 테스트 인증/인가 API입니다.")
@RestController
@RequestMapping("/test/user")
@RequiredArgsConstructor
public class TestUserController {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Operation(summary = "(테스트용) 유저를 이메일로 찾아 삭제합니다.")
    @DeleteMapping
    @Transactional
    public ResponseEntity<CommonResponse<Void>> deleteUserByEmail(@RequestParam @Email String email) {
        userRepository
                .findByEmail(email)
                .map(user -> {
                    userRepository.delete(user);
                    refreshTokenRepository.deleteByEmail(email);
                    return user;
                })
                .orElseThrow(() -> new CustomException(USER_NOT_FOUND));

        var body = CommonResponse.success(COMMON204);
        return ResponseEntity.ok(body);
    }

    @Operation(summary = "(테스트용) 유저를 id로 찾아 삭제합니다.")
    @DeleteMapping("/{userId}")
    @Transactional
    public ResponseEntity<CommonResponse<Void>> deleteUserById(@PathVariable Long userId) {
        userRepository
                .findById(userId)
                .map(user -> {
                    userRepository.delete(user);
                    refreshTokenRepository.deleteByEmail(user.getEmail());
                    return user;
                })
                .orElseThrow(() -> new CustomException(USER_NOT_FOUND));

        var body = CommonResponse.success(COMMON204);
        return ResponseEntity.ok(body);
    }
}
