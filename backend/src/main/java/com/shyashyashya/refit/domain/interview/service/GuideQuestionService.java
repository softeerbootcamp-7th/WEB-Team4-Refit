package com.shyashyashya.refit.domain.interview.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_FOUND;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.interview.service.policy.InterviewGuideQuestionPolicy;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GuideQuestionService {

    private final InterviewRepository interviewRepository;

    private final InterviewValidator interviewValidator;
    private final RequestUserContext requestUserContext;

    private final InterviewGuideQuestionPolicy interviewGuideQuestionPolicy;

    @Transactional(readOnly = true)
    public String getGuideQuestion(Long interviewId) {
        User currentUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, currentUser);
        interviewValidator.validateInterviewReviewStatus(interview, List.of(InterviewReviewStatus.LOG_DRAFT));

        String rawText = interview.getRawText();

        return interviewGuideQuestionPolicy.generate(rawText);
    }
}
