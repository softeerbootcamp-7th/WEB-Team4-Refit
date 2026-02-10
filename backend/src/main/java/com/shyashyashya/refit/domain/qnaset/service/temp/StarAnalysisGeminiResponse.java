package com.shyashyashya.refit.domain.qnaset.service.temp;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class StarAnalysisGeminiResponse {
    @JsonProperty("S")
    private StarInclusionLevel s;

    @JsonProperty("T")
    private StarInclusionLevel t;

    @JsonProperty("A")
    private StarInclusionLevel a;

    @JsonProperty("R")
    private StarInclusionLevel r;

    @JsonProperty("overall_summary")
    private String overallSummary;
}
