package com.shyashyashya.refit.global.gemini.generator;

import com.shyashyashya.refit.batch.model.CategoryVectorDocument;
import com.shyashyashya.refit.batch.model.QuestionVectorDocument;
import com.shyashyashya.refit.global.gemini.generator.resource.CategoryNameGenerateResource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class CategoryNamePromptGenerator extends PromptGenerator<CategoryNameGenerateResource> {

    @Override
    public String generatePrompt(CategoryNameGenerateResource resource) {
        var request = convertToRequest(resource.clusters(), resource.questionVectors());
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

    private record CategoryNameCreatePromptRequest(Long tempCategoryId, List<String> questions) {}

    private List<CategoryNameCreatePromptRequest> convertToRequest(
            List<CategoryVectorDocument> categoryClusters, List<QuestionVectorDocument> questionVectors) {
        return categoryClusters.stream()
                .map(category -> {
                    List<Long> questionIds = category.getQuestionDocumentIds();
                    List<String> questions = questionVectors.stream()
                            .filter(questionVector -> questionIds.contains(questionVector.getId()))
                            .map(QuestionVectorDocument::getQuestion)
                            .toList();
                    return new CategoryNameCreatePromptRequest(category.getId(), questions);
                })
                .toList();
    }
}
