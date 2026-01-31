package com.shyashyashya.refit.domain.interview.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.interview.dto.InterviewMyResponse;
import com.shyashyashya.refit.domain.interview.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/interview/my")
@RequiredArgsConstructor
public class InterviewMyController {

    private final InterviewService interviewService;

    @GetMapping
    public ResponseEntity<CommonResponse<InterviewMyResponse>> getMyInterviews() {
        var body = interviewService.getMyInterviews();
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }
}
