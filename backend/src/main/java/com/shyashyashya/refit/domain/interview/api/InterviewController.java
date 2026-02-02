package com.shyashyashya.refit.domain.interview.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON201;
import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON204;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewResultStatusUpdateRequest;
import com.shyashyashya.refit.domain.interview.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/interview")
public class InterviewController {

    private final InterviewService interviewService;

    @GetMapping("/{interviewId}")
    public ResponseEntity<CommonResponse<InterviewDto>> getInterview(@PathVariable Long interviewId) {
        var body = interviewService.getInterview(interviewId);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{interviewId}")
    public ResponseEntity<CommonResponse<Void>> deleteInterview(@PathVariable Long interviewId) {
        interviewService.deleteInterview(interviewId);
        var response = CommonResponse.success(COMMON204);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{interviewId}/result-status")
    public ResponseEntity<CommonResponse<Void>> updateInterviewResultStatus(
            @PathVariable Long interviewId, @Valid @RequestBody InterviewResultStatusUpdateRequest request) {

        interviewService.updateResultStatus(interviewId, request);

        var response = CommonResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<CommonResponse<Void>> createInterview(@RequestBody InterviewCreateRequest request) {
        interviewService.createInterview(request);
        var response = CommonResponse.success(COMMON201);
        return ResponseEntity.ok(response);
    }
}
