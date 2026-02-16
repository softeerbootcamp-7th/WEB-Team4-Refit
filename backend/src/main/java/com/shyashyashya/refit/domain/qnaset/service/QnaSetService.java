package com.shyashyashya.refit.domain.qnaset.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.QNA_SET_NOT_FOUND;

import com.shyashyashya.refit.domain.industry.service.validator.IndustryValidator;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.jobcategory.service.validator.JobCategoryValidator;
import com.shyashyashya.refit.domain.qnaset.dto.PdfHighlightingDto;
import com.shyashyashya.refit.domain.qnaset.dto.request.PdfHighlightingUpdateRequest;
import com.shyashyashya.refit.domain.qnaset.dto.request.QnaSetReviewUpdateRequest;
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
import java.util.Set;
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
            Set<Long> industryIds, Set<Long> jobCategoryIds, Pageable pageable) {
        industryValidator.validateIndustriesAllExist(industryIds);
        jobCategoryValidator.validateJobCategoriesAllExist(jobCategoryIds);

        return qnaSetRepository
                .searchByIndustriesAndJobCategories(industryIds, jobCategoryIds, pageable)
                .map(FrequentQnaSetResponse::from);
    }

    @Transactional
    public void markDifficultQuestion(Long qnaSetId) {
        QnaSet qnaSet = getValidatedQnaSet(qnaSetId);
        qnaSet.markDifficult();
    }

    @Transactional
    public void unmarkDifficultQuestion(Long qnaSetId) {
        QnaSet qnaSet = getValidatedQnaSet(qnaSetId);
        qnaSet.unmarkDifficult();
    }

    @Transactional
    public void updateQnaSet(Long qnaSetId, QnaSetUpdateRequest request) {
        QnaSet qnaSet = getValidatedQnaSet(qnaSetId);

        interviewValidator.validateInterviewReviewStatus(qnaSet.getInterview(), InterviewReviewStatus.QNA_SET_DRAFT);
        qnaSet.updateQuestionText(request.questionText());
        qnaSet.updateAnswerText(request.answerText());
    }

    @Transactional
    public void deleteQnaSet(Long qnaSetId) {
        QnaSet qnaSet = getValidatedQnaSet(qnaSetId);
        interviewValidator.validateInterviewReviewStatus(qnaSet.getInterview(), InterviewReviewStatus.QNA_SET_DRAFT);
        qnaSetRepository.delete(qnaSet);
    }

    @Transactional
    public void updateQnaSetSelfReview(Long qnaSetId, QnaSetReviewUpdateRequest request) {
        QnaSet qnaSet = getValidatedQnaSet(qnaSetId);

        interviewValidator.validateInterviewReviewStatus(
                qnaSet.getInterview(), InterviewReviewStatus.SELF_REVIEW_DRAFT);
        updateOrCreateSelfReview(qnaSet, request.selfReviewText());
    }

    @Transactional
    public void updatePdfHighlighting(Long qnaSetId, List<PdfHighlightingUpdateRequest> request) {
        QnaSet qnaSet = getValidatedQnaSet(qnaSetId);
        interviewValidator.validateInterviewReviewStatus(qnaSet.getInterview(), InterviewReviewStatus.QNA_SET_DRAFT);
        deleteAllHighlightingsAndRects(qnaSet);
        saveAllHighlightings(qnaSet, request);
    }

    @Transactional(readOnly = true)
    public List<PdfHighlightingDto> getPdfHighlightings(Long qnaSetId) {
        QnaSet qnaSet = getValidatedQnaSet(qnaSetId);
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

    @Transactional
    public void deletePdfHighlighting(Long qnaSetId) {
        QnaSet qnaSet = getValidatedQnaSet(qnaSetId);
        interviewValidator.validateInterviewReviewStatus(qnaSet.getInterview(), InterviewReviewStatus.QNA_SET_DRAFT);
        deleteAllHighlightingsAndRects(qnaSet);
    }

    @Transactional(readOnly = true)
    public QnaSet getQnaSet(Long qnaSetId) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        User requestUser = requestUserContext.getRequestUser();
        Interview interview = qnaSet.getInterview();
        interviewValidator.validateInterviewOwner(interview, requestUser);

        return qnaSet;
    }

    @Transactional(readOnly = true)
    public Page<QnaSetScrapFolderResponse> getMyScrapFoldersWithQnaSetContainingInfo(Long qnaSetId, Pageable pageable) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));

        User requestUser = requestUserContext.getRequestUser();
        Interview interview = qnaSet.getInterview();
        interviewValidator.validateInterviewOwner(interview, requestUser);

        return qnaSetScrapFolderRepository.findAllScrapFoldersWithQnaSetContainingInfo(requestUser, qnaSet, pageable);
    }

    // TODO: ID->Entity 변환기 별도로 분리 고려
    private QnaSet getValidatedQnaSet(Long qnaSetId) {
        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));
        User requestUser = requestUserContext.getRequestUser();
        interviewValidator.validateInterviewOwner(qnaSet.getInterview(), requestUser);
        return qnaSet;
    }

    private void updateOrCreateSelfReview(QnaSet qnaSet, String reqSelfReviewText) {
        if (reqSelfReviewText == null) {
            return;
        }
        qnaSetSelfReviewRepository
                .findByQnaSet(qnaSet)
                .ifPresentOrElse(
                        selfReview -> selfReview.updateSelfReviewText(reqSelfReviewText),
                        () -> qnaSetSelfReviewRepository.save(QnaSetSelfReview.create(reqSelfReviewText, qnaSet)));
    }

    private void deleteAllHighlightingsAndRects(QnaSet qnaSet) {
        pdfHighlightingRectRepository.deleteAllByQnaSet(qnaSet);
        pdfHighlightingRepository.deleteAllByQnaSet(qnaSet);
    }

    private void saveAllHighlightings(QnaSet qnaSet, List<PdfHighlightingUpdateRequest> request) {
        request.forEach(reqDto -> {
            PdfHighlighting pdfHighlighting = PdfHighlighting.create(reqDto.highlightingText(), qnaSet);
            pdfHighlightingRepository.save(pdfHighlighting);

            if (reqDto.rects() == null) {
                return;
            }
            reqDto.rects().stream()
                    .map(rectDto -> PdfHighlightingRect.create(
                            rectDto.x(),
                            rectDto.y(),
                            rectDto.width(),
                            rectDto.height(),
                            rectDto.pageNumber(),
                            pdfHighlighting))
                    .forEach(pdfHighlightingRectRepository::save);
        });
    }
}
