package com.shyashyashya.refit.domain.industry.service;

import com.shyashyashya.refit.domain.industry.dto.IndustryResponse;
import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IndustryService {

    private final IndustryRepository industryRepository;

    @Transactional(readOnly = true)
    public List<IndustryResponse> getIndustries() {
        return industryRepository.findAll().stream().map(IndustryResponse::from).toList();
    }
}
