package com.shyashyashya.refit.domain.interview.dto.response;

import com.shyashyashya.refit.domain.interview.dto.InterviewDto;
import com.shyashyashya.refit.domain.interview.model.Interview;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record DashboardCalendarResponse(
        @NotNull LocalDate date,
        @NotNull Long dDay,
        @NotNull List<InterviewDto> interviews) {

    public static DashboardCalendarResponse of(LocalDate date, Long dDay, List<Interview> interviews) {
        return new DashboardCalendarResponse(
                date, dDay, interviews.stream().map(InterviewDto::from).toList());
    }
}
