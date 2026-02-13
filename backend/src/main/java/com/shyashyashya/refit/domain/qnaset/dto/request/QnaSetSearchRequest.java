package com.shyashyashya.refit.domain.qnaset.dto.request;

import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Set;

public record QnaSetSearchRequest(String keyword, @NotNull QnaSearchFilter searchFilter) {
    public record QnaSearchFilter(
            Boolean hasStarAnalysis,
            Set<StarInclusionLevel> sInclusionLevels,
            Set<StarInclusionLevel> tInclusionLevels,
            Set<StarInclusionLevel> aInclusionLevels,
            Set<StarInclusionLevel> rInclusionLevels) {}
}
