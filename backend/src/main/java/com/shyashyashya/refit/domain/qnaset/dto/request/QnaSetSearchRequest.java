package com.shyashyashya.refit.domain.qnaset.dto.request;

import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;
import java.util.List;

public record QnaSetSearchRequest(String keyword, QnaSearchFilter searchFilter) {
    public record QnaSearchFilter(
            Boolean hasStarAnalysis,
            List<StarInclusionLevel> sInclusionLevels,
            List<StarInclusionLevel> tInclusionLevels,
            List<StarInclusionLevel> aInclusionLevels,
            List<StarInclusionLevel> rInclusionLevels) {}
}
