package com.shyashyashya.refit.domain.interview.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LogDraftSaveRequest (
        @NotNull @Size(max=10000) String draft
) {}
