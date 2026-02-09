package com.shyashyashya.refit.domain.jobcategory.api;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.global.dto.ApiResponse;
import com.shyashyashya.refit.domain.jobcategory.dto.response.JobCategoryResponse;
import com.shyashyashya.refit.domain.jobcategory.service.JobCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Job Category API", description = "직무 관련 API 입니다.")
@RestController
@RequestMapping("/job-category")
@RequiredArgsConstructor
public class JobCategoryController {

    private final JobCategoryService jobCategoryService;

    @Operation(summary = "직무 리스트를 조회합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<JobCategoryResponse>>> getAllJobCategories() {
        var body = jobCategoryService.getJobCategories();
        var response = ApiResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }
}
