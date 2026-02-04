package com.shyashyashya.refit.domain.qnaset.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.INDUSTRY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.JOB_CATEGORY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.QNA_SET_NOT_FOUND;

import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.domain.qnaset.dto.request.PdfHighlightingUpdateRequest;
import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetResponse;
import com.shyashyashya.refit.domain.qnaset.model.PdfHighlighting;
import com.shyashyashya.refit.domain.qnaset.model.PdfHighlightingRect;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.repository.PdfHighlightingRectRepository;
import com.shyashyashya.refit.domain.qnaset.repository.PdfHighlightingRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
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
    private final PdfHighlightingRepository pdfHighlightingRepository;
    private final PdfHighlightingRectRepository pdfHighlightingRectRepository;

    private final InterviewValidator interviewValidator;
    private final RequestUserContext requestUserContext;

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
    public void updatePdfHighlighting(Long qnaSetId, List<PdfHighlightingUpdateRequest> request) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        User requestUser = requestUserContext.getRequestUser();
        Interview interview = qnaSet.getInterview();
        interviewValidator.validateInterviewOwner(interview, requestUser);

        deleteAllHighlightingsAndRects(qnaSet);
        saveAllHighlightings(qnaSet, request);
    }

    private void deleteAllHighlightingsAndRects(QnaSet qnaSet) {
        List<Long> pdfHighlightingIds = pdfHighlightingRepository.findIdsByQnaSet(qnaSet);
        if (!pdfHighlightingIds.isEmpty()) {
            pdfHighlightingRectRepository.deleteAllByPdfHighlightingIds(pdfHighlightingIds);
        }
        pdfHighlightingRepository.deleteAllByQnaSet(qnaSet);
    }

    private void saveAllHighlightings(QnaSet qnaSet, List<PdfHighlightingUpdateRequest> request) {
        request.forEach(reqDto -> {
            PdfHighlighting pdfHighlighting = PdfHighlighting.create(reqDto.highlightingText(), qnaSet);
            pdfHighlightingRepository.save(pdfHighlighting);

            if (reqDto.rects() != null) {
                reqDto.rects().stream()
                        .map(rectDto -> PdfHighlightingRect.create(
                                rectDto.x(),
                                rectDto.y(),
                                rectDto.width(),
                                rectDto.height(),
                                rectDto.pageNum(),
                                pdfHighlighting))
                        .forEach(pdfHighlightingRectRepository::save);
            }
        });
    }
}
