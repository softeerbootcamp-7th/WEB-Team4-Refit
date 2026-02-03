package com.shyashyashya.refit.domain.interview.service.policy;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class RandomInterviewGuideQuestionPolicy implements InterviewGuideQuestionPolicy {
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

    public String generate(String rawText) {
        int idx = (int) System.currentTimeMillis() % (GUIDE_QUESTIONS.size());
        return GUIDE_QUESTIONS.get(idx);
    }
}
