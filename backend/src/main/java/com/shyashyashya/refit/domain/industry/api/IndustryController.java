package com.shyashyashya.refit.domain.industry.api;

import com.shyashyashya.refit.domain.common.dto.CommonResponse;
import com.shyashyashya.refit.domain.common.model.ResponseCode;
import com.shyashyashya.refit.domain.industry.dto.IndustryResponse;
import com.shyashyashya.refit.domain.industry.service.IndustryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;

@Tag(name = "Industry API", description = "산업군 관련 API 입니다.")
@RestController
@RequestMapping("/industry")
@RequiredArgsConstructor
public class IndustryController {

    private final IndustryService industryService;

    @Operation(summary = "산업군 리스트를 조회합니다.")
    @GetMapping
    public ResponseEntity<CommonResponse<List<IndustryResponse>>> getIndustries() {
        var body = industryService.getIndustries();
        var response = CommonResponse.success(COMMON200, body);
        return ResponseEntity.ok(response);
    }
}
