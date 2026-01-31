package com.shyashyashya.refit.domain.company.dto;

import com.shyashyashya.refit.domain.company.model.Company;

public record CompanyDto(
        Long companyId,
        String companyName,
        String companyLogoUrl
) {
    public static CompanyDto from(Company company) {
        return new CompanyDto(company.getId(), company.getName(), company.getLogoUrl());
    }
}
