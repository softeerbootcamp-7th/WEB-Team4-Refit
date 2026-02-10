package com.shyashyashya.refit.domain.qnaset.constant;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.global.property.GeminiProperty;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

@Component
public class StarAnalysisGeneratePrompt {

    private final String promptTemplateHeader;
    private final String promptTemplateTail;

    public StarAnalysisGeneratePrompt(GeminiProperty geminiProperty) {
        Path promptDir = Path.of(geminiProperty.promptPath());
        Path headerPath = promptDir.resolve("star_analysis_header.txt");
        Path tailPath = promptDir.resolve("star_analysis_tail.txt");

        this.promptTemplateHeader = readTextFile(headerPath);
        this.promptTemplateTail   = readTextFile(tailPath);
    }

    private String readTextFile(Path path) {
        try {
            return Files.readString(path, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException("프롬프트 파일을 읽지 못했습니다: " + path.toAbsolutePath(), e);
        }
    }
    public String buildPrompt(QnaSet qnaSet) {
        return promptTemplateHeader + "\n"
                + "[면접 질문]" + "\n"
                + qnaSet.getQuestionText() + "\n"
                + "[면접 답변]" + "\n"
                + qnaSet.getAnswerText() + "\n"
                + promptTemplateTail;
    }
}
