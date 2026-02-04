package com.shyashyashya.refit.domain.user.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON204;
import static com.shyashyashya.refit.global.exception.ErrorCode.USER_NOT_FOUND;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.auth.repository.RefreshTokenRepository;
import com.shyashyashya.refit.global.auth.service.CookieUtil;
import com.shyashyashya.refit.global.constant.AuthConstant;
import com.shyashyashya.refit.global.exception.CustomException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "** Test API **", description = "Test API for Development")
@RestController
@RequestMapping("/test/user")
@RequiredArgsConstructor
public class TestUserController {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final CookieUtil cookieUtil;

    @DeleteMapping
    @Transactional
    public ResponseEntity<CommonResponse<Void>> deleteUserByEmail(
            @RequestParam @Email String email,
            @CookieValue(value = AuthConstant.REFRESH_TOKEN, required = false) String refreshToken) {
        var deleteAccessTokenCookie = cookieUtil.deleteCookie(AuthConstant.ACCESS_TOKEN);
        var deleteRefreshTokenCookie = cookieUtil.deleteCookie(AuthConstant.REFRESH_TOKEN);

        userRepository
                .findByEmail(email)
                .map(user -> {
                    userRepository.delete(user);
                    refreshTokenRepository.deleteByToken(refreshToken);
                    return user;
                })
                .orElseThrow(() -> new CustomException(USER_NOT_FOUND));

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, deleteAccessTokenCookie)
                .header(HttpHeaders.SET_COOKIE, deleteRefreshTokenCookie)
                .body(CommonResponse.success(COMMON204));
    }
}
