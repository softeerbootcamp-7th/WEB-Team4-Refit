package com.shyashyashya.refit.domain.qnaset.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.QNA_SET_NOT_FOUND;

import com.shyashyashya.refit.domain.industry.service.validator.IndustryValidator;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.jobcategory.service.validator.JobCategoryValidator;
import com.shyashyashya.refit.domain.qnaset.dto.PdfHighlightingDto;
import com.shyashyashya.refit.domain.qnaset.dto.request.PdfHighlightingUpdateRequest;
import com.shyashyashya.refit.domain.qnaset.dto.request.QnaSetUpdateRequest;
import com.shyashyashya.refit.domain.qnaset.dto.response.FrequentQnaSetResponse;
import com.shyashyashya.refit.domain.qnaset.dto.response.QnaSetScrapFolderResponse;
import com.shyashyashya.refit.domain.qnaset.model.PdfHighlighting;
import com.shyashyashya.refit.domain.qnaset.model.PdfHighlightingRect;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetSelfReview;
import com.shyashyashya.refit.domain.qnaset.repository.PdfHighlightingRectRepository;
import com.shyashyashya.refit.domain.qnaset.repository.PdfHighlightingRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetSelfReviewRepository;
import com.shyashyashya.refit.domain.scrapfolder.repository.QnaSetScrapFolderRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QnaSetService {

    private final QnaSetRepository qnaSetRepository;
    private final QnaSetSelfReviewRepository qnaSetSelfReviewRepository;
    private final PdfHighlightingRepository pdfHighlightingRepository;
    private final QnaSetScrapFolderRepository qnaSetScrapFolderRepository;
    private final PdfHighlightingRectRepository pdfHighlightingRectRepository;
    private final RequestUserContext requestUserContext;
    private final InterviewValidator interviewValidator;
    private final IndustryValidator industryValidator;
    private final JobCategoryValidator jobCategoryValidator;

    @Transactional(readOnly = true)
    public Page<FrequentQnaSetResponse> getFrequentQuestions(
            List<Long> industryIds, List<Long> jobCategoryIds, Pageable pageable) {
        industryIds = removeDuplicatedIds(industryIds);
        jobCategoryIds = removeDuplicatedIds(jobCategoryIds);

        industryValidator.validateIndustriesAllExist(industryIds);
        jobCategoryValidator.validateJobCategoriesAllExist(jobCategoryIds);

        return qnaSetRepository
                .searchByIndustriesAndJobCategories(industryIds, jobCategoryIds, pageable)
                .map(FrequentQnaSetResponse::from);
    }

    @Transactional
    public void markDifficultQuestion(Long qnaSetId) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        User requesetUser = requestUserContext.getRequestUser();
        Interview interview = qnaSet.getInterview();
        interviewValidator.validateInterviewOwner(interview, requesetUser);

        qnaSet.markDifficult();
    }

    @Transactional
    public void unmarkDifficultQuestion(Long qnaSetId) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        User requesetUser = requestUserContext.getRequestUser();
        Interview interview = qnaSet.getInterview();
        interviewValidator.validateInterviewOwner(interview, requesetUser);

        qnaSet.unmarkDifficult();
    }

    @Transactional
    public void updateQnaSet(Long qnaSetId, QnaSetUpdateRequest request) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        User requestUser = requestUserContext.getRequestUser();
        Interview interview = qnaSet.getInterview();
        interviewValidator.validateInterviewOwner(interview, requestUser);

        qnaSet.updateQuestionText(request.questionText());
        qnaSet.updateAnswerText(request.answerText());
        updateOrCreateSelfReview(qnaSet, request.selfReviewText());
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

    @Transactional(readOnly = true)
    public List<PdfHighlightingDto> getPdfHighlightings(Long qnaSetId) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        User requestUser = requestUserContext.getRequestUser();
        Interview interview = qnaSet.getInterview();
        interviewValidator.validateInterviewOwner(interview, requestUser);

        List<PdfHighlighting> pdfHighlightings = pdfHighlightingRepository.findAllByQnaSet(qnaSet);
        if (pdfHighlightings.isEmpty()) {
            return Collections.emptyList();
        }

        List<PdfHighlightingRect> allRects = pdfHighlightingRectRepository.findAllByPdfHighlightingIn(pdfHighlightings);
        Map<PdfHighlighting, List<PdfHighlightingRect>> rectsByHighlighting =
                allRects.stream().collect(Collectors.groupingBy(PdfHighlightingRect::getPdfHighlighting));

        return pdfHighlightings.stream()
                .map(highlighting -> PdfHighlightingDto.of(
                        highlighting,
                        rectsByHighlighting.getOrDefault(highlighting, java.util.Collections.emptyList())))
                .toList();
    }

    @Transactional(readOnly = true)
    public QnaSet getQnaSet(Long qnaSetId) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        User requestUser = requestUserContext.getRequestUser();
        Interview interview = qnaSet.getInterview();
        interviewValidator.validateInterviewOwner(interview, requestUser);

        return qnaSet;
    }

    private void updateOrCreateSelfReview(QnaSet qnaSet, String reqSelfReviewText) {
        if (reqSelfReviewText != null) {
            qnaSetSelfReviewRepository
                    .findByQnaSet(qnaSet)
                    .ifPresentOrElse(
                            selfReview -> selfReview.updateSelfReviewText(reqSelfReviewText),
                            () -> qnaSetSelfReviewRepository.save(QnaSetSelfReview.create(reqSelfReviewText, qnaSet)));
        }
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
                                rectDto.pageNumber(),
                                pdfHighlighting))
                        .forEach(pdfHighlightingRectRepository::save);
            }
        });
    }

    private void deleteAllHighlightingsAndRects(QnaSet qnaSet) {
        pdfHighlightingRectRepository.deleteAllByQnaSet(qnaSet);
        pdfHighlightingRepository.deleteAllByQnaSet(qnaSet);
    }

    @Transactional(readOnly = true)
    public Page<QnaSetScrapFolderResponse> getMyScrapFoldersWithQnaSetContainingInfo(Long qnaSetId, Pageable pageable) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        User requestUser = requestUserContext.getRequestUser();
        Interview interview = qnaSet.getInterview();
        interviewValidator.validateInterviewOwner(interview, requestUser);

        return qnaSetScrapFolderRepository.findAllScrapFoldersWithQnaSetContainingInfo(requestUser, qnaSet, pageable);
    }

    private List<Long> removeDuplicatedIds(List<Long> list) {
        if (list == null) {
            return null;
        }
        return list.stream().distinct().toList();
    }

    public void deleteQnaSet(Long qnaSetId) {
        // TODO qnaSet 소유권 검증 공통 로직 메소드 분리
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));
        User requestUser = requestUserContext.getRequestUser();
        interviewValidator.validateInterviewOwner(qnaSet.getInterview(), requestUser);
        interviewValidator.validateInterviewSReviewStatusQnaSetDraft(qnaSet.getInterview());
        qnaSetRepository.deleteById(qnaSetId);
    }
}
