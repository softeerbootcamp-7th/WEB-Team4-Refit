package com.shyashyashya.refit.domain.qnaset.dto.request;

import static com.shyashyashya.refit.domain.qnaset.constant.QnaSetConstant.HIGHLIGHTING_TEXT_MAX_LENGTH;

import com.shyashyashya.refit.domain.qnaset.dto.PdfHighlightingRectDto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record PdfHighlightingUpdateRequest(
        @NotNull @Size(max = HIGHLIGHTING_TEXT_MAX_LENGTH) String highlightingText,
        @NotNull List<PdfHighlightingRectDto> rects) {}
