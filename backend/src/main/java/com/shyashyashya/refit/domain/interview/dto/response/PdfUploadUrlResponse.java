package com.shyashyashya.refit.domain.interview.dto.response;

import java.util.Map;

public record PdfUploadUrlResponse(
        String url,
        String key,
        Map<String, String> fields
) {
}
