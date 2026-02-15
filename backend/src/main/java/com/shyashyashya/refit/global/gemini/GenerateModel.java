package com.shyashyashya.refit.global.gemini;

public enum GenerateModel {
    GEMINI_2_5_PRO("gemini-2.5-pro"),
    GEMINI_2_5_FLASH_LITE("gemini-2.5-flash-lite"),
    GEMINI_2_5_FLASH("gemini-2.5-flash"),
    GEMINI_3_FLASH("gemini-3-flash-preview"),
    GEMINI_3_PRO("gemini-3-pro-preview"),

    GEMMA_3_1B_IT("gemma-3-1b-it"),
    GEMMA_3_4B_IT("gemma-3-4b-it"),
    GEMMA_3_12B_IT("gemma-3-12b-it"),
    GEMMA_3_27B_IT("gemma-3-27b-it");

    private static final String PREFIX = "https://generativelanguage.googleapis.com/v1beta/models/";
    private static final String SUFFIX = ":generateContent";

    private final String name;
    private final String endpoint;

    GenerateModel(String name) {
        this.name = name;
        this.endpoint = PREFIX + name + SUFFIX;
    }

    public String id() {
        return name;
    }

    public String endpoint() {
        return endpoint;
    }
}
