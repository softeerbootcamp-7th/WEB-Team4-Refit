package com.shyashyashya.refit.domain.qnaset.constant;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.global.property.GeminiProperty;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import static com.shyashyashya.refit.domain.qnaset.constant.StarAnalysisConstant.PROMPT_HEADER_FILE_NAME;
import static com.shyashyashya.refit.domain.qnaset.constant.StarAnalysisConstant.PROMPT_TAIL_FILE_NAME;

@Component
@RequiredArgsConstructor
@Slf4j
public class StarAnalysisGeneratePromptBuilder {

    private final GeminiProperty geminiProperty;
    private String promptTemplateHeader;
    private String promptTemplateTail;

    @PostConstruct
    private void init() {
        Path promptDir = Path.of(geminiProperty.promptPath());
        Path headerPath = promptDir.resolve(PROMPT_HEADER_FILE_NAME);
        Path tailPath = promptDir.resolve(PROMPT_TAIL_FILE_NAME);

        this.promptTemplateHeader = readTextFile(headerPath);
        this.promptTemplateTail = readTextFile(tailPath);
    }

    public String buildPrompt(QnaSet qnaSet) {
        return promptTemplateHeader + "\n"
                + "[면접 질문]" + "\n"
                + qnaSet.getQuestionText() + "\n"
                + "[면접 답변]" + "\n"
                + qnaSet.getAnswerText() + "\n"
                + promptTemplateTail;
    }

    private String readTextFile(Path path) {
        try {
            return Files.readString(path, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException("프롬프트 파일을 읽지 못했습니다: " + path.toAbsolutePath(), e);
        }
    }
}
