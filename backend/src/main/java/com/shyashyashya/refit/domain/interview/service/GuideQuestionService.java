package com.shyashyashya.refit.domain.interview.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_FOUND;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GuideQuestionService {

    private final InterviewRepository interviewRepository;

    private final InterviewValidator interviewValidator;

    @Transactional(readOnly = true)
    public String getGuideQuestion(Long interviewId) {
        // TODO 현재 사용자 가져오기
        User currentUser = null;
        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, currentUser);

        String rawText = interview.getRawText();
        return randomGuideQuestion.generate(rawText);
    }

    @FunctionalInterface
    interface GuideQuestionPolicy {
        String generate(String rawText);
    }

    private final GuideQuestionPolicy randomGuideQuestion = rawText -> {
        return null;
    };
}
