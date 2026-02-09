package com.shyashyashya.refit.domain.user.api;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON201;

import com.shyashyashya.refit.global.dto.CommonResponse;
import com.shyashyashya.refit.domain.user.dto.request.UserSignUpRequest;
import com.shyashyashya.refit.domain.user.dto.response.MyProfileResponse;
import com.shyashyashya.refit.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User API", description = "유저와 관련된 API 입니다.")
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "새롭게 회원가입 합니다.", description = "현재 로그인한 계정이 아직 등록되지 않은 상태일 때만 회원가입 할 수 있습니다.")
    @PostMapping("/signup")
    public ResponseEntity<CommonResponse<Void>> signUp(@Valid @RequestBody UserSignUpRequest userSignUpRequest) {
        userService.signUp(userSignUpRequest);
        var response = CommonResponse.success(COMMON201);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "이용 약관에 동의합니다.")
    @PostMapping("/my/terms/agree")
    public ResponseEntity<CommonResponse<Void>> agreeToTerms() {
        userService.agreeToTerms();
        return ResponseEntity.ok(CommonResponse.success(COMMON200));
    }

    @Operation(summary = "현재 로그인한 유저의 기본 정보를 조회합니다.")
    @GetMapping("/my")
    public ResponseEntity<CommonResponse<MyProfileResponse>> getMyProfileInfo() {
        var myPageResponse = userService.getMyProfileInfo();
        var response = CommonResponse.success(COMMON200, myPageResponse);
        return ResponseEntity.ok(response);
    }
}
