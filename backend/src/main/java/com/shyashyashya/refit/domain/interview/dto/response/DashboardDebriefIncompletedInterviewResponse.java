package com.shyashyashya.refit.domain.interview.dto.response;

import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.interview.model.Interview;

public record DashboardDebriefIncompletedInterviewResponse(InterviewDto interview, Long passedDays) {
    public static DashboardDebriefIncompletedInterviewResponse of(Interview interview, Long passedDays) {
        return new DashboardDebriefIncompletedInterviewResponse(InterviewDto.from(interview), passedDays);
    }
}
