package com.shyashyashya.refit.global.gemini.generator;

import com.shyashyashya.refit.global.gemini.generator.resource.InterviewRawTextConvertResource;
import com.shyashyashya.refit.global.property.GeminiProperty;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

@Component
@RequiredArgsConstructor
public class InterviewRawTextConvertPromptGenerator extends PromptGenerator<InterviewRawTextConvertResource> {

    private static final String RAW_TEXT_CONVERT_PROMPT_FILE_NAME = "qna_set_generate_prompt.txt";

    private final GeminiProperty geminiProperty;

    private String promptTemplate;

    @PostConstruct
    private void init() {
        Path promptDir = Path.of(geminiProperty.promptPath());
        Path promptPath = promptDir.resolve(RAW_TEXT_CONVERT_PROMPT_FILE_NAME);
        this.promptTemplate = readTextFile(promptPath);
    }

    @Override
    public String generatePrompt(InterviewRawTextConvertResource resource) {
        return promptTemplate + "\n" + resource.interview().getRawText() + "\n" + "\"\"\"";
    }
}
