package com.shyashyashya.refit.domain.interview.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON201;
import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON204;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.interview.dto.InterviewFullDto;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewResultStatusUpdateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.KptSelfReviewUpdateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.RawTextUpdateRequest;
import com.shyashyashya.refit.domain.interview.dto.response.GuideQuestionResponse;
import com.shyashyashya.refit.domain.interview.service.GuideQuestionService;
import com.shyashyashya.refit.domain.interview.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/interview")
public class InterviewController {

    private final InterviewService interviewService;
    private final GuideQuestionService guideQuestionService;

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
    public ResponseEntity<CommonResponse<Void>> createInterview(@Valid @RequestBody InterviewCreateRequest request) {
        interviewService.createInterview(request);
        var response = CommonResponse.success(COMMON201);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{interviewId}/qna-sets")
    public ResponseEntity<CommonResponse<InterviewFullDto>> getInterviewFull(@PathVariable Long interviewId) {
        var body = interviewService.getInterviewFull(interviewId);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{interviewId}/guide-question")
    public ResponseEntity<CommonResponse<GuideQuestionResponse>> getGuideQuestion(@PathVariable Long interviewId) {
        String guideQuestion = guideQuestionService.getGuideQuestion(interviewId);

        var response = CommonResponse.success(COMMON200, new GuideQuestionResponse(guideQuestion));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{interviewId}/raw-text")
    public ResponseEntity<CommonResponse<Void>> updateRawText(
            @PathVariable Long interviewId, @Valid @RequestBody RawTextUpdateRequest request) {
        interviewService.updateRawText(interviewId, request);
        var response = CommonResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{interviewId}/kpt-self-review")
    public ResponseEntity<CommonResponse<Void>> updateKptSelfReview(
            @PathVariable Long interviewId, @Valid @RequestBody KptSelfReviewUpdateRequest request) {
        interviewService.updateKptSelfReview(interviewId, request);
        var response = CommonResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }
}
