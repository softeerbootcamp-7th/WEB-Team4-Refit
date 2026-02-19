package com.shyashyashya.refit.global.gemini.dto;

import java.util.List;

public record CategoryNameCreateGeminiResponse(List<CategoryNameCreateGeminiResponseItem> items) {
    public record CategoryNameCreateGeminiResponseItem(Long cid, String categoryName, String question) {}
}
