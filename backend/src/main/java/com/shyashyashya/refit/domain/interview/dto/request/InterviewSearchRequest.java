package com.shyashyashya.refit.domain.interview.dto.request;

import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import java.time.LocalDate;
import java.util.List;

public record InterviewSearchRequest(String keyword, InterviewSearchFilter searchFilter) {
    public record InterviewSearchFilter(
            List<InterviewType> interviewType,
            List<InterviewResultStatus> interviewResultStatus,
            LocalDate startDate,
            LocalDate endDate) {}
}
