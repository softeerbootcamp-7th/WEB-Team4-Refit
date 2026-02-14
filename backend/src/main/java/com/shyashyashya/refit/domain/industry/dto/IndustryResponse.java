package com.shyashyashya.refit.domain.industry.dto;

import com.shyashyashya.refit.domain.industry.model.Industry;
import jakarta.validation.constraints.NotNull;

public record IndustryResponse(
        @NotNull Long industryId, @NotNull String industryName) {

    public static IndustryResponse from(Industry industry) {
        return new IndustryResponse(industry.getId(), industry.getName());
    }
}
