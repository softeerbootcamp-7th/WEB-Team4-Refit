package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.interview.model.StarInclusionLevel;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record StarAnalysisDto(
        @NotNull StarInclusionLevel sInclusionLevel,
        @NotNull StarInclusionLevel tInclusionLevel,
        @NotNull StarInclusionLevel aInclusionLevel,
        @NotNull StarInclusionLevel rInclusionLevel,
        @NotNull @Size(max = 500) String overallSummary) {}
