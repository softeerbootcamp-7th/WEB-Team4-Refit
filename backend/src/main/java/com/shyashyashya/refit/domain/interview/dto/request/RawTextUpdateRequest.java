package com.shyashyashya.refit.domain.interview.dto.request;

import static com.shyashyashya.refit.domain.interview.constant.InterviewConstant.RAW_TEXT_MAX_LENGTH;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RawTextUpdateRequest(
        @NotNull @Size(max = RAW_TEXT_MAX_LENGTH) String rawText) {}
