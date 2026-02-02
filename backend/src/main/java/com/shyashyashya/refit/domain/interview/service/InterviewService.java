package com.shyashyashya.refit.domain.interview.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.INDUSTRY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.JOB_CATEGORY_NOT_FOUND;

import com.shyashyashya.refit.domain.company.model.Company;
import com.shyashyashya.refit.domain.company.repository.CompanyRepository;
import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.domain.interview.dto.InterviewSimpleDto;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewResultStatusUpdateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewSearchRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final CompanyRepository companyRepository;
    private final IndustryRepository industryRepository;
    private final JobCategoryRepository jobCategoryRepository;

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

    @Transactional
    public void updateResultStatus(Long interviewId, InterviewResultStatusUpdateRequest request) {
        User requestUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));

        interviewValidator.validateInterviewOwner(interview, requestUser);

        interview.updateResultStatus(request.interviewResultStatus());
    }

    @Transactional(readOnly = true)
    public Page<InterviewSimpleDto> getMyInterviewsByReviewStatus(
            InterviewReviewStatus reviewStatus, Pageable pageable) {
        User requestUser = requestUserContext.getRequestUser();

        return interviewRepository
                .findAllByUserAndReviewStatus(requestUser, reviewStatus, pageable)
                .map(InterviewSimpleDto::from);
    }

    @Transactional(readOnly = true)
    public Page<InterviewSimpleDto> searchMyInterviews(InterviewSearchRequest request, Pageable pageable) {
        User requestUser = requestUserContext.getRequestUser();

        return interviewRepository
                .searchInterviews(
                        requestUser,
                        request.keyword(),
                        request.searchFilter().interviewType(),
                        request.searchFilter().interviewResultStatus(),
                        request.searchFilter().startDate(),
                        request.searchFilter().endDate())
                .map(InterviewSimpleDto::from);
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
