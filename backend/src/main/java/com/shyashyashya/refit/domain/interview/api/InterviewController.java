package com.shyashyashya.refit.domain.interview.api;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON201;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON204;

import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.interview.dto.InterviewFullDto;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewResultStatusUpdateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.KptSelfReviewUpdateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.QnaSetCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.RawTextUpdateRequest;
import com.shyashyashya.refit.domain.interview.dto.response.GuideQuestionResponse;
import com.shyashyashya.refit.domain.interview.dto.response.QnaSetCreateResponse;
import com.shyashyashya.refit.domain.interview.service.GuideQuestionService;
import com.shyashyashya.refit.domain.interview.service.InterviewService;
import com.shyashyashya.refit.global.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "Interview API", description = "면접 기록 및 면접 회고 작성 관련 API 입니다.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/interview")
public class InterviewController {

    private final InterviewService interviewService;
    private final GuideQuestionService guideQuestionService;

    @Operation(summary = "면접 데이터를 생성합니다.")
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createInterview(@Valid @RequestBody InterviewCreateRequest request) {
        interviewService.createInterview(request);
        var response = ApiResponse.success(COMMON201);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "특정 면접 정보를 조회합니다.", description = "면접에 대한 정보만 조회하며, 면접에 속한 질문, 회고 등의 정보는 조회하지 않습니다.")
    @GetMapping("/{interviewId}")
    public ResponseEntity<ApiResponse<InterviewDto>> getInterview(@PathVariable Long interviewId) {
        var body = interviewService.getInterview(interviewId);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "면접을 삭제합니다.", description = "면접 삭제시 해당 면접에 기록된 질문, 회고 데이터도 함께 삭제됩니다.")
    @DeleteMapping("/{interviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteInterview(@PathVariable Long interviewId) {
        interviewService.deleteInterview(interviewId);
        var response = ApiResponse.success(COMMON204);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "면접 결과를 수정합니다.")
    @PatchMapping("/{interviewId}/result-status")
    public ResponseEntity<ApiResponse<Void>> updateInterviewResultStatus(
            @PathVariable Long interviewId, @Valid @RequestBody InterviewResultStatusUpdateRequest request) {
        interviewService.updateResultStatus(interviewId, request);
        var response = ApiResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "면접 및 면접에 관련된 질문, 회고 데이터를 모두 조회합니다.")
    @GetMapping("/{interviewId}/qna-sets")
    public ResponseEntity<ApiResponse<InterviewFullDto>> getInterviewFull(@PathVariable Long interviewId) {
        var body = interviewService.getInterviewFull(interviewId);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "면접 기록 중, 가이드 질문을 조회합니다.")
    @GetMapping("/{interviewId}/guide-question")
    public ResponseEntity<ApiResponse<GuideQuestionResponse>> getGuideQuestion(@PathVariable Long interviewId) {
        String guideQuestion = guideQuestionService.getGuideQuestion(interviewId);
        var response = ApiResponse.success(COMMON200, new GuideQuestionResponse(guideQuestion));
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "면접 기록 데이터를 생성/수정합니다.", description = "질문, 답변으로 변환되기 전 raw 면접 기록 데이터를 수정합니다.")
    @PutMapping("/{interviewId}/raw-text")
    public ResponseEntity<ApiResponse<Void>> updateRawText(
            @PathVariable Long interviewId, @Valid @RequestBody RawTextUpdateRequest request) {
        interviewService.updateRawText(interviewId, request);
        var response = ApiResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "면접에 대한 KPT 회고를 생성/수정합니다.")
    @PutMapping("/{interviewId}/kpt-self-review")
    public ResponseEntity<ApiResponse<Void>> updateKptSelfReview(
            @PathVariable Long interviewId, @Valid @RequestBody KptSelfReviewUpdateRequest request) {
        interviewService.updateKptSelfReview(interviewId, request);
        var response = ApiResponse.success(COMMON200);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "특정 면접에 새로운 질답 세트를 생성합니다.")
    @PostMapping("/{interviewId}/qna-set")
    public ResponseEntity<ApiResponse<QnaSetCreateResponse>> createQnaSet(
            @PathVariable Long interviewId, @Valid @RequestBody QnaSetCreateRequest request) {
        var body = interviewService.createQnaSet(interviewId, request);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }
}
