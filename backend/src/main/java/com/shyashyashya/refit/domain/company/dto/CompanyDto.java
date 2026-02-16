package com.shyashyashya.refit.domain.company.dto;

import com.shyashyashya.refit.domain.company.model.Company;
import jakarta.validation.constraints.NotNull;

public record CompanyDto(@NotNull Long companyId, @NotNull String companyName, String companyLogoUrl) {
    public static CompanyDto from(Company company) {
        return new CompanyDto(company.getId(), company.getName(), company.getLogoUrl());
    }
}
