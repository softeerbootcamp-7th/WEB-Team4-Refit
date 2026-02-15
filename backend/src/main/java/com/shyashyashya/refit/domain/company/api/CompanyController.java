package com.shyashyashya.refit.domain.company.api;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;

import com.shyashyashya.refit.domain.company.api.response.CompanyResponse;
import com.shyashyashya.refit.domain.company.service.CompanyService;
import com.shyashyashya.refit.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/company")
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CompanyResponse>>> findCompanies(
            @RequestParam(required = false) String q, @ParameterObject Pageable pageable) {
        var response = companyService.findCompanies(q, pageable);
        var body = ApiResponse.success(COMMON200, response);
        return ResponseEntity.ok(body);
    }
}
