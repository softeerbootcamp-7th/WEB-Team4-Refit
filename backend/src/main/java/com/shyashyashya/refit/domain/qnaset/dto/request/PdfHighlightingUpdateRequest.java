package com.shyashyashya.refit.domain.qnaset.dto.request;

import com.shyashyashya.refit.domain.qnaset.dto.PdfHighlightingRectDto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record PdfHighlightingUpdateRequest(
        @NotNull @Size(max = 2000) String highlightingText, List<PdfHighlightingRectDto> rects) {}
