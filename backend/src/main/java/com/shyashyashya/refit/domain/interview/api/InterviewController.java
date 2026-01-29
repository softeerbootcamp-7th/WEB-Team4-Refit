package com.shyashyashya.refit.domain.interview.api;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.common.model.ResponseCode;
import com.shyashyashya.refit.domain.interview.dto.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.service.InterviewService;
import com.shyashyashya.refit.domain.user.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/interview")
@Slf4j
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    public ResponseEntity<CommonResponse<Void>> createInterview(@RequestBody InterviewCreateRequest request) {

        // TODO 요청 유저 받아오기
        User reqUser = null;
        Long interviewId = interviewService.createInterview(reqUser, request);

        return ResponseEntity.ok(CommonResponse.success(ResponseCode.CREATED));
    }
}
