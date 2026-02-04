package com.shyashyashya.refit.domain.interview.dto.response;

import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import java.util.List;

public record DashboardUpcomingInterviewResponse(
        InterviewDto upcomingInterview, List<String> frequentlyAskedQuestions, List<InterviewDto> relatedInterviews) {

    public static DashboardUpcomingInterviewResponse of(
            Interview upcomingInterview, List<QnaSet> frequentlyAskedQuestions, List<Interview> relatedInterviews) {

        return new DashboardUpcomingInterviewResponse(
                InterviewDto.from(upcomingInterview),
                // TODO : 질문에서 민감정보 제거 로직 태우기
                frequentlyAskedQuestions.stream().map(QnaSet::getQuestionText).toList(),
                relatedInterviews.stream().map(InterviewDto::from).toList());
    }
}
