package com.shyashyashya.refit.global.gemini.generator;

import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.global.gemini.generator.resource.StarAnalysisGenerateResource;
import com.shyashyashya.refit.global.property.GeminiProperty;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

@Component
@RequiredArgsConstructor
public class StarAnalysisPromptGenerator extends PromptGenerator<StarAnalysisGenerateResource> {

    private static final String STAR_ANALYSIS_CREATE_PROMPT_HEADER_FILE_NAME = "star_analysis_header.txt";
    private static final String STAR_ANALYSIS_CREATE_PROMPT_TAIL_FILE_NAME = "star_analysis_tail.txt";

    private final GeminiProperty geminiProperty;

    private String promptTemplateHeader;
    private String promptTemplateTail;

    @PostConstruct
    private void init() {
        Path promptDir = Path.of(geminiProperty.promptPath());
        Path headerPath = promptDir.resolve(STAR_ANALYSIS_CREATE_PROMPT_HEADER_FILE_NAME);
        Path tailPath = promptDir.resolve(STAR_ANALYSIS_CREATE_PROMPT_TAIL_FILE_NAME);

        this.promptTemplateHeader = readTextFile(headerPath);
        this.promptTemplateTail = readTextFile(tailPath);
    }

    @Override
    public String generatePrompt(StarAnalysisGenerateResource resource) {
        QnaSet qnaSet = resource.qnaSet();
        return promptTemplateHeader + "\n"
                + "[면접 질문]" + "\n"
                + qnaSet.getQuestionText() + "\n"
                + "[면접 답변]" + "\n"
                + qnaSet.getAnswerText() + "\n"
                + promptTemplateTail;
    }
}
