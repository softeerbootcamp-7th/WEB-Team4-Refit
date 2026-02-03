package com.shyashyashya.refit.domain.interview.service.policy;

@FunctionalInterface
public interface InterviewGuideQuestionPolicy {
    String generate(String rawText);
}
