package com.shyashyashya.refit.domain.interview.dto.request;

import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Set;

public record InterviewSearchRequest(
        String keyword,

        @NotNull(message = "검색 조건 필드는 필수 입니다. 검색 조건을 넣지 않고 조회하려는 경우, 해당 필드를 빈 배열, null 등으로 채워서 요청해주세요.") InterviewSearchFilter searchFilter) {
    public record InterviewSearchFilter(
            Set<InterviewType> interviewType,
            Set<InterviewResultStatus> interviewResultStatus,
            LocalDate startDate,
            LocalDate endDate) {}
}
