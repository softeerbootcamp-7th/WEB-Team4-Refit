package com.shyashyashya.refit.domain.interview.api;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.interview.dto.response.DashboardCalendarResponse;
import com.shyashyashya.refit.domain.interview.dto.response.DashboardHeadlineResponse;
import com.shyashyashya.refit.domain.interview.dto.response.DashboardUpcomingInterviewResponse;
import com.shyashyashya.refit.domain.interview.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Dashboard API", description = "대시보드 화면에서 사용하는 API 입니다.")
@Validated
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(summary = "대시보드 헤드라인에 들어갈 정보를 조회합니다.")
    @GetMapping("/headline")
    public ResponseEntity<CommonResponse<DashboardHeadlineResponse>> getDashboardHeadline() {
        var body = dashboardService.getDashboardHeadlineData();
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "대시보드 캘린더에 등록된 면접 일정을 조회합니다.")
    @GetMapping("/calendar/interview")
    public ResponseEntity<CommonResponse<List<DashboardCalendarResponse>>> getDashboardCalendarInterviews(
            @RequestParam @Positive Integer year, @RequestParam @Min(1) @Max(12) Integer month) {
        var body = dashboardService.getDashboardCalendarInterviews(year, month);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "대시보드에서 '곧 있을 면접' 영역의 데이터를 조회합니다.")
    @GetMapping("/interview/upcoming")
    public ResponseEntity<CommonResponse<Page<DashboardUpcomingInterviewResponse>>> getUpcomingInterviews(
            Pageable pageable) {
        var body = dashboardService.getUpcomingInterviews(pageable);
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }
}
