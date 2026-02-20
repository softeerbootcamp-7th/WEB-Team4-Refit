package com.shyashyashya.refit.domain.interview.dto.response;

import com.shyashyashya.refit.domain.interview.model.InterviewConvertStatus;
import jakarta.validation.constraints.NotNull;

public record ConvertResultResponse(
        @NotNull Long interviewId, @NotNull InterviewConvertStatus convertStatus) {

    public static ConvertResultResponse of(Long interviewId, InterviewConvertStatus convertStatus) {
        return new ConvertResultResponse(interviewId, convertStatus);
    }
}
