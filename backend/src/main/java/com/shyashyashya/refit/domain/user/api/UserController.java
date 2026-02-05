package com.shyashyashya.refit.domain.user.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON201;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.user.dto.request.UserSignUpRequest;
import com.shyashyashya.refit.domain.user.dto.response.MyProfileResponse;
import com.shyashyashya.refit.domain.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<CommonResponse<Void>> signUp(@Valid @RequestBody UserSignUpRequest userSignUpRequest) {
        userService.signUp(userSignUpRequest);
        var response = CommonResponse.success(COMMON201);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/my/terms/agree")
    public ResponseEntity<CommonResponse<Void>> agreeToTerms() {
        userService.agreeToTerms();
        return ResponseEntity.ok(CommonResponse.success(COMMON200));
    }

    @GetMapping("/my")
    public ResponseEntity<CommonResponse<MyProfileResponse>> getMyProfileInfo() {
        var myPageResponse = userService.getMyProfileInfo();
        var response = CommonResponse.success(COMMON200, myPageResponse);
        return ResponseEntity.ok(response);
    }
}
