package com.shyashyashya.refit.global.util;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.global.property.GeminiProperty;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

@Component
@RequiredArgsConstructor
public class PromptGenerateUtil {

    public static final String RAW_TEXT_CONVERT_PROMPT_FILE_NAME = "qna_set_generate_prompt";
    public static final String STAR_ANALYSIS_CREATE_PROMPT_HEADER_FILE_NAME = "star_analysis_header.txt";
    public static final String STAR_ANALYSIS_CREATE_PROMPT_TAIL_FILE_NAME = "star_analysis_tail.txt";

    private final GeminiProperty geminiProperty;

    private String promptTemplate;
    private String promptTemplateHeader;
    private String promptTemplateTail;

    @PostConstruct
    private void init() {
        Path promptDir = Path.of(geminiProperty.promptPath());
        Path promptPath = promptDir.resolve(RAW_TEXT_CONVERT_PROMPT_FILE_NAME);
        Path headerPath = promptDir.resolve(STAR_ANALYSIS_CREATE_PROMPT_HEADER_FILE_NAME);
        Path tailPath = promptDir.resolve(STAR_ANALYSIS_CREATE_PROMPT_TAIL_FILE_NAME);

        this.promptTemplate = readTextFile(promptPath);
        this.promptTemplateHeader = readTextFile(headerPath);
        this.promptTemplateTail = readTextFile(tailPath);
    }

    public String buildInterviewRawTextConvertPrompt(Interview interview) {
        return promptTemplate + "\n" + interview.getRawText() + "\n" + "\"\"\"";
    }

    public String buildStarAnalysisCreatePrompt(QnaSet qnaSet) {
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
