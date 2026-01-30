package com.shyashyashya.refit.domain.interview.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_FOUND;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.util.RequestUserContext;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GuideQuestionService {

    private final InterviewRepository interviewRepository;

    private final InterviewValidator interviewValidator;
    private final RequestUserContext requestUserContext;

    @Transactional(readOnly = true)
    public String getGuideQuestion(Long interviewId) {
        User currentUser = requestUserContext.getRequestUser();

        Interview interview =
                interviewRepository.findById(interviewId).orElseThrow(() -> new CustomException(INTERVIEW_NOT_FOUND));
        interviewValidator.validateInterviewOwner(interview, currentUser);

        String rawText = interview.getRawText();

        return randomGuideQuestion.generate(rawText);
    }

    @FunctionalInterface
    private interface GuideQuestionPolicy {
        String generate(String rawText);
    }

    private final GuideQuestionPolicy randomGuideQuestion = rawText -> {
        int idx = (int) System.currentTimeMillis() % (GUIDE_QUESTIONS.size());
        return GUIDE_QUESTIONS.get(idx);
    };

    private static final List<String> GUIDE_QUESTIONS = List.of(
            "입사 후 포부가 무엇입니까?",
            "입사 5년 후, 10년 후 자신의 모습은 어떨 것이라고 생각합니까?",
            "본인의 직업관은 무엇입니까?",
            "당신에게 일이 왜 중요합니까?",
            "직장은 어떤 면을 보고 선택합니까?",
            "일하는 목적이 무엇입니까?",
            "어떤 회사가 훌륭한 회사라고 생각합니까?",
            "인생에서 가장 필요한 사항은 무엇이라 생각하나요?",
            "많은 직무 중 이 직무를 선택한 이유는 무엇입니까?",
            "바람직한 사원상은 무엇이라고 생각합니까?");
}
