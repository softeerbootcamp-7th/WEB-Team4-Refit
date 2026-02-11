package com.shyashyashya.refit.domain.industry.service.validator;

import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.shyashyashya.refit.global.exception.ErrorCode.INDUSTRY_PARTIALLY_NOT_FOUND;

@Component
@RequiredArgsConstructor
public class IndustryValidator {

    private final IndustryRepository industryRepository;

    public void validateIndustriesAllExist(List<Long> industryIds) {
        if (industryIds == null || industryIds.isEmpty()) {
            return;
        }

        long count = industryRepository.countAllByIdIn(industryIds);
        if (count != industryIds.size()) {
            throw new CustomException(INDUSTRY_PARTIALLY_NOT_FOUND);
        }
    }
}
