package com.shyashyashya.refit.batch.service;

import com.shyashyashya.refit.batch.model.CategoryVectorDocument;
import com.shyashyashya.refit.batch.model.QuestionVectorDocument;
import com.shyashyashya.refit.batch.repository.QuestionCategoryVectorRepository;
import com.shyashyashya.refit.batch.repository.QuestionVectorRepository;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetCategoryRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.global.gemini.dto.CategoryNameCreateGeminiResponse;
import com.shyashyashya.refit.global.util.ClusterUtil;
import com.shyashyashya.refit.global.util.GeminiUtil;
import com.shyashyashya.refit.global.util.PromptGenerateUtil;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionCategoryBatchService {

    private final QnaSetRepository qnaSetRepository;
    private final QnaSetCategoryRepository qnaSetCategoryRepository;
    private final QuestionVectorRepository questionVectorRepository;
    private final QuestionCategoryVectorRepository categoryVectorRepository;
    private final GeminiUtil geminiUtil;
    private final ClusterUtil clusterUtil;
    private final PromptGenerateUtil promptGenerateUtil;

    @Transactional
    public void createCategories() {
        log.info("[createCategories] 1. 모든 질문 및 질문 임베딩 벡터 조회");
        List<QuestionVectorDocument> questionVectors =
                questionVectorRepository.findAll().toList();

        log.info("[createCategories] 2. 질문 임베딩 벡터 클러스터링");
        List<CategoryVectorDocument> clusters = clusterUtil.createClusters(questionVectors);

        log.info("[createCategories] 3. LLM 으로 클러스터 별 이름 및 대표질문 생성");
        String prompt = promptGenerateUtil.buildCategoryNameCreatePrompt(clusters, questionVectors);
        CategoryNameCreateGeminiResponse result =
                geminiUtil.sendTextGenerateRequest(prompt, CategoryNameCreateGeminiResponse.class);

        log.info("[createCategories] 4. 클러스터를 QnaSetCategory 로 변환하여 DB에 저장");
        Map<Long, Long> tempIdToCategoryId = new HashMap<>();
        Map<Long, String> tempIdToCategoryName = new HashMap<>();
        for (var item : result.items()) {
            QnaSetCategory category = QnaSetCategory.create(item.categoryName(), item.question(), 0.0);
            Long realId = qnaSetCategoryRepository.save(category).getId();
            log.info("[createCategories] save qna set category: id={}, name={}", realId, item.categoryName());
            tempIdToCategoryId.put(item.cid(), realId);
            tempIdToCategoryName.put(item.cid(), item.categoryName());
        }

        log.info("[createCategories] 5. 카테고리 벡터 저장 & QnaSet categoryId 업데이트");
        for (CategoryVectorDocument tempCategory : clusters) {
            Long tempCategoryId = tempCategory.getId();
            Long categoryId = tempIdToCategoryId.get(tempCategoryId);
            String categoryName = tempIdToCategoryName.get(tempCategoryId);

            if (categoryId == null || categoryName == null) {
                continue;
            }

            log.debug("[createCategories] save question category vector");
            CategoryVectorDocument categoryVectorDocument = CategoryVectorDocument.of(
                    categoryId, tempCategory.getCentroidVector(), Map.of("categoryName", categoryName));
            categoryVectorRepository.save(categoryVectorDocument);

            log.debug("[createCategories] update qna-set's category FK");
            QnaSetCategory qnaSetCategory =
                    qnaSetCategoryRepository.findById(categoryId).orElseThrow();

            List<Long> questionIds = tempCategory.getQuestionDocumentIds();
            qnaSetRepository.updateQnaSetCategoryQnaSetIdsIn(qnaSetCategory, questionIds);
        }

        log.info("[createCategories] 6. QnaSet 이 분류되지 않은 카테고리 삭제");
        List<Long> notEmptyCategoryIds = qnaSetCategoryRepository.findAllNotEmptyCategoryIds();
        categoryVectorRepository
                .findAll()
                .filter(document -> !notEmptyCategoryIds.contains(document.getId()))
                .forEach(document -> categoryVectorRepository.deleteById(document.getId()));
        qnaSetCategoryRepository.deleteEmptyCategory();
    }
}
