package com.shyashyashya.refit.domain.user.api;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.user.dto.request.MyProfileUpdateRequest;
import com.shyashyashya.refit.domain.user.dto.request.UserSignUpRequest;
import com.shyashyashya.refit.domain.user.dto.response.MyProfileResponse;
import com.shyashyashya.refit.domain.user.service.UserService;
import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
import com.shyashyashya.refit.global.auth.service.CookieUtil;
import com.shyashyashya.refit.global.dto.ApiResponse;
import com.shyashyashya.refit.global.util.ClientOriginType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User API", description = "유저와 관련된 API 입니다.")
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CookieUtil cookieUtil;

    @Operation(
            summary = "새롭게 회원가입 합니다.",
            description = "현재 로그인한 계정이 아직 등록되지 않은 상태일 때만 회원가입 할 수 있습니다. 회원가입이 성공하면 토큰을 새로 발급합니다.")
    @PostMapping("/signup")
    public ResponseEntity<Void> signUp(
            @RequestParam(required = false) String origin, @Valid @RequestBody UserSignUpRequest userSignUpRequest) {
        ClientOriginType originType = ClientOriginType.fromOriginString(origin);
        TokenPairDto tokenPairDto = userService.signUp(userSignUpRequest);

        String accessTokenCookie = cookieUtil.createAccessTokenCookie(tokenPairDto.accessToken(), originType);
        String refreshTokenCookie = cookieUtil.createResponseTokenCookie(tokenPairDto.refreshToken(), originType);

        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie)
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie)
                .header(HttpHeaders.LOCATION, originType.getClientOriginUrl())
                .build();
    }

    @Operation(summary = "이용 약관에 동의합니다.")
    @PostMapping("/my/terms/agree")
    public ResponseEntity<ApiResponse<Void>> agreeToTerms() {
        userService.agreeToTerms();
        return ResponseEntity.ok(ApiResponse.success(COMMON200));
    }

    @Operation(summary = "현재 로그인한 유저의 기본 정보를 조회합니다.")
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<MyProfileResponse>> getMyProfileInfo() {
        var myPageResponse = userService.getMyProfileInfo();
        var response = ApiResponse.success(COMMON200, myPageResponse);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "사용자 프로필을 수정합니다.")
    @PutMapping("/my")
    public ResponseEntity<ApiResponse<Void>> updateMyProfile(
            @Valid @RequestBody MyProfileUpdateRequest myProfileUpdateRequest) {
        userService.updateMyProfile(myProfileUpdateRequest);
        return ResponseEntity.ok(ApiResponse.success(COMMON200));
    }
}
