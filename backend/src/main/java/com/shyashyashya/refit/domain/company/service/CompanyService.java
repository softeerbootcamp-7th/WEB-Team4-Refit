package com.shyashyashya.refit.domain.company.service;

import com.shyashyashya.refit.domain.company.api.response.CompanyResponse;
import com.shyashyashya.refit.domain.company.repository.CompanyRepository;
import com.shyashyashya.refit.global.util.HangulUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final HangulUtil hangulUtil;

    public Page<CompanyResponse> findCompanies(String query, Pageable pageable) {
        return companyRepository.findAllBySearchQuery(hangulUtil.decompose(query), pageable);
    }
}
