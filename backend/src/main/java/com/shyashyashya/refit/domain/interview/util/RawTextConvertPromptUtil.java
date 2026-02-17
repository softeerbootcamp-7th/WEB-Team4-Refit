package com.shyashyashya.refit.domain.interview.util;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.global.property.GeminiProperty;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RawTextConvertPromptUtil {

    public static final String PROMPT_FILE_NAME = "qna_set_generate_prompt";

    private final GeminiProperty geminiProperty;
    private String promptTemplate;

    @PostConstruct
    private void init() {
        Path promptDir = Path.of(geminiProperty.promptPath());
        Path promptPath = promptDir.resolve(PROMPT_FILE_NAME);

        this.promptTemplate = readTextFile(promptPath);
    }

    public String buildPrompt(Interview interview) {
        return promptTemplate + "\n" + interview.getRawText() + "\n" + "\"\"\"";
    }

    private String readTextFile(Path path) {
        try {
            return Files.readString(path, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException("프롬프트 파일을 읽지 못했습니다: " + path.toAbsolutePath(), e);
        }
    }
}
