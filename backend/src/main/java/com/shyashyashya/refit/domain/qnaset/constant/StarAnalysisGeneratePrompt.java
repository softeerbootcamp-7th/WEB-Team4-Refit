package com.shyashyashya.refit.domain.qnaset.constant;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public final class StarAnalysisGeneratePrompt {

    private static final Path PROMPT_DIR = Path.of("/prompt");
    private static final Path HEADER_PATH = PROMPT_DIR.resolve("header.txt");
    private static final Path TAIL_PATH   = PROMPT_DIR.resolve("tail.txt");

    private static final String PROMPT_TEMPLATE_HEADER;
    private static final String PROMPT_TEMPLATE_TAIL;

    static {
        PROMPT_TEMPLATE_HEADER = readTextFile(HEADER_PATH);
        PROMPT_TEMPLATE_TAIL = readTextFile(TAIL_PATH);
    }

    private StarAnalysisGeneratePrompt() {}

    private static String readTextFile(Path path) {
        try {
            return Files.readString(path, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException("프롬프트 파일을 읽지 못했습니다: " + path.toAbsolutePath(), e);
        }
    }
    public static String buildPrompt(QnaSet qnaSet) {
        return PROMPT_TEMPLATE_HEADER + "[면접 질문]"
                + qnaSet.getQuestionText()
                + "\n" + "[면접 답변]"
                + qnaSet.getAnswerText()
                + "\n" + PROMPT_TEMPLATE_TAIL;
    }
}
