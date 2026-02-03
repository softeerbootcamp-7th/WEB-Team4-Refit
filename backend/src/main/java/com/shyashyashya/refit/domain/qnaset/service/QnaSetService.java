package com.shyashyashya.refit.domain.qnaset.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.INDUSTRY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.JOB_CATEGORY_NOT_FOUND;

import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.domain.qnaset.dto.request.PdfHighlightingUpdateRequest;
import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetResponse;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.global.exception.CustomException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QnaSetService {

    private final QnaSetRepository qnaSetRepository;
    private final IndustryRepository industryRepository;
    private final JobCategoryRepository jobCategoryRepository;

    @Transactional(readOnly = true)
    public List<FrequentQnaSetResponse> getFrequentQuestions(Long industryId, Long jobCategoryId) {

        Industry industry =
                industryRepository.findById(industryId).orElseThrow(() -> new CustomException(INDUSTRY_NOT_FOUND));

        JobCategory jobCategory = jobCategoryRepository
                .findById(jobCategoryId)
                .orElseThrow(() -> new CustomException(JOB_CATEGORY_NOT_FOUND));

        return qnaSetRepository.findAllByIndustryAndJobCategory(industry, jobCategory).stream()
                .map(FrequentQnaSetResponse::from)
                .toList();
    }

    @Transactional
    public void updatePdfHighlighting(Long qnaSetId, PdfHighlightingUpdateRequest request) {}
}
