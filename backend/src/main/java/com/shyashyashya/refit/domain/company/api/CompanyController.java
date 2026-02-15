package com.shyashyashya.refit.domain.company.api;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.company.api.response.CompanyResponse;
import com.shyashyashya.refit.domain.company.service.CompanyService;
import com.shyashyashya.refit.global.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Company API", description = "회사 관련 API 입니다.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/company")
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    @Operation(summary = "회사 목록을 검색합니다.", description = "회사 목록을 검색합니다. 한글의 일부가 완성되어도 검새이 가능합니다.")
    public ResponseEntity<ApiResponse<Page<CompanyResponse>>> findCompanies(
            @RequestParam(required = false) String q, @ParameterObject Pageable pageable) {
        var response = companyService.findCompanies(q, pageable);
        var body = ApiResponse.success(COMMON200, response);
        return ResponseEntity.ok(body);
    }
}
