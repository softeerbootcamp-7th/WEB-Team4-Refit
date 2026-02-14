package com.shyashyashya.refit.domain.interview.dto.response;

import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.interview.model.Interview;
import jakarta.validation.constraints.NotNull;

public record DashboardDebriefIncompletedInterviewResponse(
        @NotNull InterviewDto interview, @NotNull Long passedDays) {
    public static DashboardDebriefIncompletedInterviewResponse of(Interview interview, Long passedDays) {
        return new DashboardDebriefIncompletedInterviewResponse(InterviewDto.from(interview), passedDays);
    }
}
