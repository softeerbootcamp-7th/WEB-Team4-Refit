package com.shyashyashya.refit.domain.interview.api;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.interview.dto.response.DashboardCalendarResponse;
import com.shyashyashya.refit.domain.interview.dto.response.DashboardDebriefIncompletedInterviewResponse;
import com.shyashyashya.refit.domain.interview.dto.response.DashboardHeadlineResponse;
import com.shyashyashya.refit.domain.interview.dto.response.DashboardMyDifficultQuestionResponse;
import com.shyashyashya.refit.domain.interview.dto.response.DashboardUpcomingInterviewResponse;
import com.shyashyashya.refit.domain.interview.service.DashboardService;
import com.shyashyashya.refit.global.dto.ApiResponse;
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

    @Operation(summary = "대시보드 헤드라인에 들어갈 정보를 조회합니다.", description = """
            대시보드 헤드라인 타입과, 해당 타입에서 필요한 데이터를 응답합니다.
            헤드라인 타입에는 다음의 4가지 타입이 응답으로 나옵니다.
            #0 "REGISTER_INTERVIEW" - 면접 일정 등록하기 (아직 면접 일정이 없는 경우, 초기 사용자)
            #1 "PREPARE_INTERVIEW"  - 면접 대비하기 (일주일 내 예정된 면접 일정이 있는 경우)
            #2 "REVIEW_INTERVIEW"   - 면접 복기 시작하기 (복기를 완료하지 않은 면접이 존재하는 경우)
            #3 "CHECK_INTERVIEW_HISTORY" - 면접 히스토 확인하기 (위 케이스에 해당하지 않는 경우)
            """)
    @GetMapping("/headline")
    public ResponseEntity<ApiResponse<DashboardHeadlineResponse>> getDashboardHeadline() {
        var body = dashboardService.getDashboardHeadlineData();
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "대시보드 캘린더에 등록된 면접 일정을 조회합니다.", description = """
            면접 일정이 존재하는 date 리스트, 각 date 별로는 해당 date 에 존재하는 면접 일정 리스트가 조회됩니다.
            date 리스트는 날짜순으로 정렬, 각 date 별 해당 date 에 존재하는 면접 일정들은 시간순으로 정렬되어 조회됩니다.
            각 면접 일정의 Dday 필드는 과거라면 음수, 미래라면 양수 값을 갖습니다.
            """)
    @GetMapping("/calendar/interview")
    public ResponseEntity<ApiResponse<List<DashboardCalendarResponse>>> getDashboardCalendarInterviews(
            @RequestParam @Positive Integer year, @RequestParam @Min(1) @Max(12) Integer month) {
        var body = dashboardService.getDashboardCalendarInterviews(year, month);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "대시보드에서 '곧 있을 면접' 영역의 데이터를 조회합니다.", description = """
            곧 보게되는 면접 정보, 유사 산업군/직군 면접 질문, 유사 면접 리스트를 조회합니다.
            각 면접 일정의 Dday 필드는 과거라면 음수, 미래라면 양수 값을 갖습니다.
            """)
    @GetMapping("/interview/upcoming")
    public ResponseEntity<ApiResponse<Page<DashboardUpcomingInterviewResponse>>> getUpcomingInterviews(
            Pageable pageable) {
        var body = dashboardService.getUpcomingInterviews(pageable);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "대시보드에서 '내가 어렵게 느낀 질문'을 조회합니다.")
    @GetMapping("/qna-set/my/difficult")
    public ResponseEntity<ApiResponse<Page<DashboardMyDifficultQuestionResponse>>> getMyDifficultQnaSets(
            Pageable pageable) {
        var body = dashboardService.getMyDifficultQnaSets(pageable);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "대시보드에서 복기 대기중인 면접 리스트를 조회합니다.")
    @GetMapping("/interview/debrief-uncompleted")
    public ResponseEntity<ApiResponse<Page<DashboardDebriefIncompletedInterviewResponse>>>
            getDebriefIncompletedInterviews(Pageable pageable) {
        var body = dashboardService.getDebriefIncompletedInterviews(pageable);
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }
}
