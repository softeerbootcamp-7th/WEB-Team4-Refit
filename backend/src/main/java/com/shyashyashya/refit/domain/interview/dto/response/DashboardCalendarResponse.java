package com.shyashyashya.refit.domain.interview.dto.response;

import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.interview.model.Interview;
import java.time.LocalDate;
import java.util.List;

public record DashboardCalendarResponse(LocalDate date, List<InterviewDto> interviews) {

    public static DashboardCalendarResponse of(LocalDate date, List<Interview> interviews) {
        return new DashboardCalendarResponse(
                date, interviews.stream().map(InterviewDto::from).toList());
    }
}
