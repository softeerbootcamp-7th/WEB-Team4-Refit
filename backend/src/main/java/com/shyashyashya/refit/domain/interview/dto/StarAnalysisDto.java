package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record StarAnalysisDto(
        @NotNull StarInclusionLevel sInclusionLevel,
        @NotNull StarInclusionLevel tInclusionLevel,
        @NotNull StarInclusionLevel aInclusionLevel,
        @NotNull StarInclusionLevel rInclusionLevel,
        @NotNull @Size(max = 500) String overallSummary) {
    public static StarAnalysisDto from(StarAnalysis starAnalysis) {
        return new StarAnalysisDto(
                starAnalysis.getSInclusionLevel(),
                starAnalysis.getTInclusionLevel(),
                starAnalysis.getAInclusionLevel(),
                starAnalysis.getRInclusionLevel(),
                starAnalysis.getOverallSummaryText());
    }
}
