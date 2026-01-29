package com.shyashyashya.refit.fixture;

import com.shyashyashya.refit.domain.company.model.Company;

public class CompanyFixture {

    public static final Company TEST_COMPANY = Company.create(
            "test company",
            "test.com/logo.png",
            true);
}
