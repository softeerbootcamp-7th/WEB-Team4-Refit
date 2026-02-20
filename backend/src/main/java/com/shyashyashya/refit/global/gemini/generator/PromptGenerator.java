package com.shyashyashya.refit.global.gemini.generator;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public abstract class PromptGenerator<T> {

    public abstract String generatePrompt(T resource);

    protected String readTextFile(Path path) {
        try {
            return Files.readString(path, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException("프롬프트 파일을 읽지 못했습니다: " + path.toAbsolutePath(), e);
        }
    }
}
