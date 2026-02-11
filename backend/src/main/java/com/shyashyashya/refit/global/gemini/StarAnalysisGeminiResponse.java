package com.shyashyashya.refit.global.gemini;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;

public record StarAnalysisGeminiResponse(
        @JsonProperty("S") StarInclusionLevel s,
        @JsonProperty("T") StarInclusionLevel t,
        @JsonProperty("A") StarInclusionLevel a,
        @JsonProperty("R") StarInclusionLevel r,
        @JsonProperty("overall_summary") String overallSummary) {}
