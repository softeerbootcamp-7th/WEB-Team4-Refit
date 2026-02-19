package com.shyashyashya.refit.global.util;

import com.shyashyashya.refit.batch.model.CategoryVectorDocument;
import com.shyashyashya.refit.batch.model.QuestionVectorDocument;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.global.property.GeminiProperty;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PromptGenerateUtil {

    public static final String RAW_TEXT_CONVERT_PROMPT_FILE_NAME = "qna_set_generate_prompt.txt";
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

    private record CategoryNameCreatePromptRequest(Long tempCategoryId, List<String> questions) {}

    public String buildCategoryNameCreatePrompt(
            List<CategoryVectorDocument> clusters, List<QuestionVectorDocument> questionVectors) {
        var request = convertToRequest(clusters, questionVectors);
        String prompt = """
            하나의 cid 에는 여러개의 질문 리스트가 있다. 그 질문들은 같은 그룹으로 클러스터링 된 질문들이다. 이 질문들을 모두 포함하는 카테고리의 이름을 작명하고, (cid, 작명된 이름, 해당 카테고리에 포함될 수 있는 대표질문 한 개) 구조로 각 cid 별로 응답하라.
            응답의 구조는 json 으로 { "items": [ {"cid": <요청으로 들어왔던 cid>, "categoryName": <작명한 이름>, "question": <해당 카테고리에서 등장할 수 있는 대표 질문>}, ...]} 형식으로 응답하라.
            응답 문자열에 json 외에 다른 데이터는 포함하지 마라.

            다음은 위에서 말한 각 클러스터의 cid 와 클러스터를 구성하는 질문들이다.
            ==================

            """ + request;

        log.debug("[buildCategoryNameCreatePrompt] created prompt: {}", prompt);
        return prompt;
    }

    private List<PromptGenerateUtil.CategoryNameCreatePromptRequest> convertToRequest(
            List<CategoryVectorDocument> categoryClusters, List<QuestionVectorDocument> questionVectors) {
        return categoryClusters.stream()
                .map(category -> {
                    List<Long> questionIds = category.getQuestionDocumentIds();
                    List<String> questions = questionVectors.stream()
                            .filter(questionVector -> questionIds.contains(questionVector.getId()))
                            .map(questionVector -> {
                                try {
                                    return questionVector.getQuestion();
                                } catch (Exception e) {
                                    log.error(
                                            "[convertToRequest] error converting question vector id {} to string",
                                            questionVector.getId(),
                                            e);
                                    return null;
                                }
                            })
                            .toList();
                    return new PromptGenerateUtil.CategoryNameCreatePromptRequest(category.getId(), questions);
                })
                .toList();
    }

    private String readTextFile(Path path) {
        try {
            return Files.readString(path, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException("프롬프트 파일을 읽지 못했습니다: " + path.toAbsolutePath(), e);
        }
    }
}
