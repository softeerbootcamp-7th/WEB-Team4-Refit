package com.shyashyashya.refit.domain.interview.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.INDUSTRY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.JOB_CATEGORY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.QNA_SET_NOT_FOUND;

import com.shyashyashya.refit.domain.company.model.Company;
import com.shyashyashya.refit.domain.company.repository.CompanyRepository;
import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.QnaSet;
import com.shyashyashya.refit.domain.interview.model.QnaSetSelfReview;
import com.shyashyashya.refit.domain.interview.model.StarAnalysis;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.interview.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.interview.repository.QnaSetSelfReviewRepository;
import com.shyashyashya.refit.domain.interview.repository.StarAnalysisRepository;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final CompanyRepository companyRepository;
    private final IndustryRepository industryRepository;
    private final JobCategoryRepository jobCategoryRepository;
    private final QnaSetRepository qnaSetRepository;
    private final QnaSetSelfReviewRepository qnaSetSelfReviewRepository;
    private final StarAnalysisRepository starAnalysisRepository;

    private final InterviewValidator interviewValidator;
    private final RequestUserContext requestUserContext;

    @Transactional
    public void createInterview(InterviewCreateRequest request) {

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

        Interview createdInterview = interviewRepository.save(interview); // 미사용?
    }

    @Transactional
    public void deleteInterview(Long interviewId) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));

        interviewValidator.validateInterviewOwner(interview, requestUser);

        interviewRepository.delete(interview);
    }

    @Transactional(readOnly = true)
    public List<QnaSet> getQnaSets(Long interviewId) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));

        interviewValidator.validateInterviewOwner(interview, requestUser);

        return qnaSetRepository.findAllByInterviewId(interviewId);
    }

    @Transactional(readOnly = true)
    public QnaSetSelfReview getSelfReview(Long qnaSetId) {
        return qnaSetSelfReviewRepository
                .findByQnaSetId(qnaSetId)
                .orElseThrow(() -> new CustomException(QNA_SET_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public StarAnalysis getStarAnalysis(Long qnaSetId) {
        return starAnalysisRepository.findByQnaSetId(qnaSetId).orElse(null);
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
}
