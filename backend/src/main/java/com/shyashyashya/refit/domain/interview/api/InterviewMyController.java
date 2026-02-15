package com.shyashyashya.refit.domain.interview.api;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.interview.dto.InterviewSimpleDto;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewDraftType;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewSearchRequest;
import com.shyashyashya.refit.domain.interview.service.InterviewService;
import com.shyashyashya.refit.global.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Interview My API", description = "면접 아카이브 데이터와 관련된 API 입니다.")
@RestController
@RequestMapping("/interview/my")
@RequiredArgsConstructor
public class InterviewMyController {

    private final InterviewService interviewService;

    @Operation(summary = "내가 복기 완료한 면접을 검색합니다.", description = """
            searchFilter 필드는 null 이 될 수 없습니다. 검색 조건이 없는 경우에도 해당 필드를 빈 배열, null 등으로 채워서 보내주세요.
            """)
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<Page<InterviewDto>>> searchInterviews(
            @Valid @RequestBody InterviewSearchRequest request, @ParameterObject Pageable pageable) {
        var body = interviewService.searchMyInterviews(request, pageable);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "내가 작성중인 (임시저장) 복기 데이터를 조회합니다.", description = """
            interviewReviewStatus 에는 LOG_DRAFT (기록 중), SELF_REVIEW_DRAFT (회고 중) 값만 들어갈 수 있습니다.
            이외의 값에 대해서는 400 에러를 응답합니다.
            """)
    @GetMapping("/draft")
    public ResponseEntity<ApiResponse<Page<InterviewSimpleDto>>> getMyInterviewDrafts(
            @RequestParam InterviewDraftType interviewDraftType, @ParameterObject Pageable pageable) {
        var body = interviewService.getMyInterviewDrafts(interviewDraftType, pageable);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }
}
