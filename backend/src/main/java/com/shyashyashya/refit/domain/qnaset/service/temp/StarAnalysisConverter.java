package com.shyashyashya.refit.domain.qnaset.service.temp;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import com.shyashyashya.refit.domain.qnaset.model.StarAnalysisStatus;
import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;

public final class StarAnalysisConverter {

    private StarAnalysisConverter() {}

    public static StarAnalysis toEntity(StarAnalysisGeminiResponse dto, QnaSet qnaSet) {
        StarInclusionLevel s = dto.getS();
        StarInclusionLevel t = dto.getT();
        StarInclusionLevel a = dto.getA();
        StarInclusionLevel r = dto.getR();

        String summary = dto.getOverallSummary();
        StarAnalysisStatus status = StarAnalysisStatus.COMPLETED;

        return StarAnalysis.create(s, t, a, r, summary, status, qnaSet);
    }
}
