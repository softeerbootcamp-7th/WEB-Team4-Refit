package com.shyashyashya.refit.domain.interview.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.INDUSTRY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_PDF_ALREADY_EXITS;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_PDF_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.JOB_CATEGORY_NOT_FOUND;

import com.shyashyashya.refit.domain.company.model.Company;
import com.shyashyashya.refit.domain.company.repository.CompanyRepository;
import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.interview.dto.InterviewFullDto;
import com.shyashyashya.refit.domain.interview.dto.InterviewSimpleDto;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewDraftType;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewResultStatusUpdateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewSearchRequest;
import com.shyashyashya.refit.domain.interview.dto.request.KptSelfReviewUpdateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.QnaSetCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.RawTextUpdateRequest;
import com.shyashyashya.refit.domain.interview.dto.response.InterviewCreateResponse;
import com.shyashyashya.refit.domain.interview.dto.response.PresignedUrlDto;
import com.shyashyashya.refit.domain.interview.dto.response.QnaSetCreateResponse;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewSelfReview;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.interview.repository.InterviewSelfReviewRepository;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.domain.qnaset.dto.StarAnalysisDto;
import com.shyashyashya.refit.domain.qnaset.model.PdfHighlighting;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetSelfReview;
import com.shyashyashya.refit.domain.qnaset.repository.PdfHighlightingRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetSelfReviewRepository;
import com.shyashyashya.refit.domain.qnaset.repository.StarAnalysisRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.aws.S3Util;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.property.S3FolderNameProperty;
import com.shyashyashya.refit.global.util.RequestUserContext;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final CompanyRepository companyRepository;
    private final IndustryRepository industryRepository;
    private final JobCategoryRepository jobCategoryRepository;
    private final QnaSetRepository qnaSetRepository;
    private final QnaSetSelfReviewRepository qnaSetSelfReviewRepository;
    private final PdfHighlightingRepository pdfHighlightingRepository;
    private final StarAnalysisRepository starAnalysisRepository;
    private final InterviewSelfReviewRepository interviewSelfReviewRepository;

    private final InterviewValidator interviewValidator;
    private final RequestUserContext requestUserContext;
    private final S3Util s3Util;
    private final S3FolderNameProperty s3FolderNameProperty;

    @Transactional(readOnly = true)
    public InterviewDto getInterview(Long interviewId) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));

        interviewValidator.validateInterviewOwner(interview, requestUser);

        return InterviewDto.from(interview);
    }

    @Transactional(readOnly = true)
    public InterviewFullDto getInterviewFull(Long interviewId) {
        User requestUser = requestUserContext.getRequestUser();
        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, requestUser);

        List<QnaSet> qnaSets = qnaSetRepository.findAllByInterview(interview);

        if (qnaSets.isEmpty()) {
            return InterviewFullDto.fromInterviewWithEmptyQnaSets(interview);
        }

        List<Long> qnaSetIds = qnaSets.stream().map(QnaSet::getId).toList();

        Map<Long, QnaSetSelfReview> selfReviewMap = qnaSetSelfReviewRepository.findAllByQnaSetIdIn(qnaSetIds).stream()
                .collect(Collectors.toMap(r -> r.getQnaSet().getId(), Function.identity()));

        Map<Long, StarAnalysisDto> starAnalysisDtoMap = starAnalysisRepository.findAllByQnaSetIdIn(qnaSetIds).stream()
                .collect(Collectors.toMap(r -> r.getQnaSet().getId(), StarAnalysisDto::from));

        InterviewSelfReview interviewSelfReview = interviewSelfReviewRepository
                .findByInterview(interview)
                .orElseGet(() -> InterviewSelfReview.createEmpty(interview));

        return InterviewFullDto.fromInterviewWithQnaSets(
                interview, qnaSets, selfReviewMap, starAnalysisDtoMap, interviewSelfReview);
    }

    @Transactional
    public InterviewCreateResponse createInterview(InterviewCreateRequest request) {

        User user = requestUserContext.getRequestUser();

        Company company = findOrSaveCompany(request);

        Industry industry = industryRepository
                .findById(request.industryId())
                .orElseThrow(() -> new CustomException(INDUSTRY_NOT_FOUND));

        JobCategory jobCategory = jobCategoryRepository
                .findById(request.jobCategoryId())
                .orElseThrow(() -> new CustomException(JOB_CATEGORY_NOT_FOUND));

        Interview interview = Interview.create(
                request.jobRole(), request.interviewType(), request.startAt(), user, company, industry, jobCategory);

        Long interviewId = interviewRepository.save(interview).getId();
        return new InterviewCreateResponse(interviewId);
    }

    @Transactional
    public void deleteInterview(Long interviewId) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));

        interviewValidator.validateInterviewOwner(interview, requestUser);

        interviewRepository.delete(interview);
    }

    @Transactional
    public void updateResultStatus(Long interviewId, InterviewResultStatusUpdateRequest request) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));

        interviewValidator.validateInterviewOwner(interview, requestUser);

        interview.updateResultStatus(request.interviewResultStatus());
    }

    @Transactional(readOnly = true)
    public Page<InterviewDto> searchMyInterviews(InterviewSearchRequest request, Pageable pageable) {
        User requestUser = requestUserContext.getRequestUser();
        return interviewRepository
                .searchInterviews(
                        requestUser,
                        request.keyword(),
                        request.searchFilter().interviewType(),
                        request.searchFilter().interviewResultStatus(),
                        request.searchFilter().startDate(),
                        request.searchFilter().endDate(),
                        pageable)
                .map(InterviewDto::from);
    }

    @Transactional
    public PresignedUrlDto createPdfUploadUrl(Long interviewId) {
        User requestUser = requestUserContext.getRequestUser();
        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, requestUser);

        if (interview.getPdfUrl() != null) {
            throw new CustomException(INTERVIEW_PDF_ALREADY_EXITS);
        }

        String key = s3FolderNameProperty.interviewPdf() + UUID.randomUUID() + ".pdf";
        PresignedUrlDto response = s3Util.createResourceUploadUrl(key, MediaType.APPLICATION_PDF);
        interview.updatePdfUrl(response.key());
        return response;
    }

    @Transactional(readOnly = true)
    public PresignedUrlDto createPdfDownloadUrl(Long interviewId) {
        User requestUser = requestUserContext.getRequestUser();
        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, requestUser);

        if (interview.getPdfUrl() == null) {
            throw new CustomException(INTERVIEW_PDF_NOT_FOUND);
        }

        String key = interview.getPdfUrl();
        return s3Util.createResourceDownloadUrl(key);
    }

    @Transactional
    public void deletePdf(Long interviewId) {
        User requestUser = requestUserContext.getRequestUser();
        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, requestUser);

        String key = interview.getPdfUrl();
        if (key == null) {
            throw new CustomException(INTERVIEW_PDF_NOT_FOUND);
        }

        s3Util.deleteFile(key);
        deleteAllPdfHighlighting(interview);
        interview.deletePdfUrl();
    }

    public Page<InterviewSimpleDto> getMyInterviewDrafts(InterviewDraftType draftType, Pageable pageable) {
        User requestUser = requestUserContext.getRequestUser();

        return switch (draftType) {
            case LOGGING ->
                interviewRepository
                        .findAllByUserAndReviewStatusIn(
                                requestUser,
                                List.of(InterviewReviewStatus.LOG_DRAFT, InterviewReviewStatus.QNA_SET_DRAFT),
                                pageable)
                        .map(InterviewSimpleDto::from);
            case REVIEWING ->
                interviewRepository
                        .findAllByUserAndReviewStatusIn(
                                requestUser, List.of(InterviewReviewStatus.SELF_REVIEW_DRAFT), pageable)
                        .map(InterviewSimpleDto::from);
        };
    }

    @Transactional
    public void updateRawText(Long interviewId, RawTextUpdateRequest request) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, requestUser);
        interviewValidator.validateInterviewReviewStatus(interview, InterviewReviewStatus.LOG_DRAFT);

        interview.updateRawText(request.rawText());
    }

    @Transactional
    public void convertRawTextToQnaSet(Long interviewId) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, requestUser);
        interviewValidator.validateInterviewReviewStatus(interview, InterviewReviewStatus.LOG_DRAFT);

        // TODO : 실제로는 서비스가 아닌 LLM 요청 성공에 따른 콜백으로 상태 변화 처리
        // convert logic
        interview.completeLogging();
    }

    @Transactional
    public void updateKptSelfReview(Long interviewId, KptSelfReviewUpdateRequest request) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, requestUser);
        interviewValidator.validateInterviewReviewStatus(interview, InterviewReviewStatus.SELF_REVIEW_DRAFT);

        interviewSelfReviewRepository
                .findByInterview(interview)
                .ifPresentOrElse(
                        selfReview -> {
                            selfReview.updateKeepText(request.keepText());
                            selfReview.updateProblemText(request.problemText());
                            selfReview.updateTryText(request.tryText());
                        },
                        () -> {
                            InterviewSelfReview created = InterviewSelfReview.create(
                                    request.keepText(), request.problemText(), request.tryText(), interview);
                            interviewSelfReviewRepository.save(created);
                        });
    }

    @Transactional
    public QnaSetCreateResponse createQnaSet(Long interviewId, QnaSetCreateRequest request) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, requestUser);
        interviewValidator.validateInterviewReviewStatus(interview, InterviewReviewStatus.QNA_SET_DRAFT);

        QnaSet createdQnaSet = qnaSetRepository.save(
                QnaSet.create(request.questionText(), request.answerText(), false, interview, null));

        return QnaSetCreateResponse.from(createdQnaSet);
    }

    @Transactional
    public void startLogging(Long interviewId) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, requestUser);
        interviewValidator.validateInterviewReviewStatus(interview, InterviewReviewStatus.NOT_LOGGED);

        interview.startLogging();
    }

    @Transactional
    public void completeQnaSetDraft(Long interviewId) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, requestUser);
        interviewValidator.validateInterviewReviewStatus(interview, InterviewReviewStatus.QNA_SET_DRAFT);

        interview.completeQnaSetDraft();
    }

    @Transactional
    public void completeSelfReview(Long interviewId) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, requestUser);
        interviewValidator.validateInterviewReviewStatus(interview, InterviewReviewStatus.SELF_REVIEW_DRAFT);

        interview.completeReview();
    }

    private Company findOrSaveCompany(InterviewCreateRequest request) {
        return companyRepository.findByName(request.companyName()).orElseGet(() -> {
            try {
                // TODO 회사 디폴트 이미지 url로 변경
                Company newCompany = Company.create(request.companyName(), null, false);
                return companyRepository.save(newCompany);
            } catch (DataIntegrityViolationException e) {
                // Race condition
                return companyRepository
                        .findByName(request.companyName())
                        .orElseThrow(
                                () -> new IllegalStateException("Company not found after concurrent save attempt"));
            }
        });
    }

    public List<InterviewSimpleDto> getMyNotLoggedInterviews() {
        User requestUser = requestUserContext.getRequestUser();

        LocalDateTime now = LocalDateTime.now();
        return interviewRepository.findInterviewsNotLoggedRecentOneMonth(requestUser, now).stream()
                .map(InterviewSimpleDto::from)
                .toList();
    }

    private void deleteAllPdfHighlighting(Interview interview) {
        List<QnaSet> qnaSets = qnaSetRepository.findAllByInterview(interview);
        if (qnaSets.isEmpty()) return;

        List<PdfHighlighting> highlightings = pdfHighlightingRepository.findAllByQnaSetIn(qnaSets);
        if (highlightings.isEmpty()) return;

        pdfHighlightingRepository.deleteAllInBatch(highlightings);
    }
}
