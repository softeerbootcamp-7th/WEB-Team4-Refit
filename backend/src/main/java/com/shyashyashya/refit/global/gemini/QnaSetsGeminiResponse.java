package com.shyashyashya.refit.global.gemini;

import java.util.List;

public record QnaSetsGeminiResponse(List<QnaSetAndReview> interactions) {

    public record QnaSetAndReview(String question, String answer, String review) {}
}
