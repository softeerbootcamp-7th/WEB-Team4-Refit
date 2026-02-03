package com.shyashyashya.refit.domain.interview.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.interview.dto.InterviewSimpleDto;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewSearchRequest;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/interview/my")
@RequiredArgsConstructor
public class InterviewMyController {

    private final InterviewService interviewService;

    @GetMapping
    public ResponseEntity<CommonResponse<Page<InterviewSimpleDto>>> getMyInterviews(
            @RequestParam InterviewReviewStatus interviewReviewStatus, Pageable pageable) {
        var body = interviewService.getMyInterviewsByReviewStatus(interviewReviewStatus, pageable);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/search")
    public ResponseEntity<CommonResponse<Page<InterviewDto>>> searchInterviews(
            @RequestBody InterviewSearchRequest request, Pageable pageable) {
        var body = interviewService.searchMyInterviews(request, pageable);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/draft")
    public ResponseEntity<CommonResponse<Page<InterviewSimpleDto>>> getMyInterviewDrafts(
            @RequestParam InterviewReviewStatus interviewReviewStatus, Pageable pageable) {
        var body = interviewService.getMyInterviewDraftsByReviewStatus(interviewReviewStatus, pageable);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }
}
