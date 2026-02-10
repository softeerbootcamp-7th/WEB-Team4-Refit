package com.shyashyashya.refit.domain.industry.service.validator;

import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.global.exception.CustomException;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.shyashyashya.refit.global.exception.ErrorCode.INDUSTRY_PARTIALLY_NOT_FOUND;

@Component
public class IndustryValidator {

    public void validateIndustriesAllExist(List<Industry> industries, List<Long> industryIds) {
        if (industries.size() != industryIds.size()) {
            throw new CustomException(INDUSTRY_PARTIALLY_NOT_FOUND);
        }
    }
}
