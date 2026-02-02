package com.shyashyashya.refit.domain.interview.dto;

import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;

public record StarAnalysisDto(
        StarInclusionLevel sInclusionLevel,
        StarInclusionLevel tInclusionLevel,
        StarInclusionLevel aInclusionLevel,
        StarInclusionLevel rInclusionLevel,
        String overallSummary) {
    public static StarAnalysisDto from(StarAnalysis starAnalysis) {
        return new StarAnalysisDto(
                starAnalysis.getSInclusionLevel(),
                starAnalysis.getTInclusionLevel(),
                starAnalysis.getAInclusionLevel(),
                starAnalysis.getRInclusionLevel(),
                starAnalysis.getOverallSummaryText());
    }
}
