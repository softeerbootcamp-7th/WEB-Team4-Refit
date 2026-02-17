package com.shyashyashya.refit.unit.fixture;

import com.shyashyashya.refit.domain.company.model.Company;
import com.shyashyashya.refit.global.util.HangulUtil;

public class CompanyFixture {

    public static final Company TEST_COMPANY = Company.create("test company", new HangulUtil().decompose("test company"), "test.com/logo.png");
}
