package com.shyashyashya.refit.domain.qnaset.event;

import com.shyashyashya.refit.batch.model.QuestionVectorDocument;
import com.shyashyashya.refit.batch.repository.QuestionCategoryVectorRepository;
import com.shyashyashya.refit.batch.repository.QuestionVectorRepository;
import com.shyashyashya.refit.domain.qnaset.constant.QnaSetConstant;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetCategoryRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.global.gemini.GeminiClient;
import com.shyashyashya.refit.global.gemini.dto.GeminiEmbeddingRequest;
import com.shyashyashya.refit.global.vectordb.model.ScoredVector;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class QuestionEmbeddingEventHandler {

    private final GeminiClient geminiClient;
    private final QuestionVectorRepository questionVectorRepository;
    private final QuestionCategoryVectorRepository questionCategoryVectorRepository;
    private final QnaSetRepository qnaSetRepository;
    private final QnaSetCategoryRepository qnaSetCategoryRepository;

    @Async("embeddingTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleQuestionUpdatedEvent(QuestionEmbeddingEvent event) {
        log.info("질답세트 ID {}의 질문 임베딩 생성 작업 시작", event.qnaSetId());

        try {
            List<Float> vector = generateEmbedding(event.updateContent());
            log.info("질답세트 ID {}의 Gemini API로부터 임베딩 응답 수신 성공", event.qnaSetId());

            saveQuestionVector(event.qnaSetId(), event.updateContent(), vector);
            log.info("질답세트 ID {}의 임베딩 VectorDB에 저장 성공", event.qnaSetId());

            updateCategoryIfSimilar(event.qnaSetId(), vector);
        } catch (Throwable e) {
            log.error("질답세트 ID {}의 질문 임베딩 생성 및 카테고리 분류 작업 중 오류 발생", event.qnaSetId(), e);
        }
    }

    private List<Float> generateEmbedding(String content) {
        GeminiEmbeddingRequest request = GeminiEmbeddingRequest.of(
                content,
                GeminiEmbeddingRequest.TaskType.SEMANTIC_SIMILARITY,
                GeminiEmbeddingRequest.OutputDimensionality.fromValue(
                        questionVectorRepository.getCollectionVectorDimension()));
        return geminiClient
                .sendAsyncEmbeddingRequest(request)
                .join()
                .embedding()
                .values();
    }

    private void saveQuestionVector(Long qnaSetId, String content, List<Float> vector) {
        questionVectorRepository.save(QuestionVectorDocument.of(qnaSetId, content, vector));
    }

    private void updateCategoryIfSimilar(Long qnaSetId, List<Float> vector) {
        List<ScoredVector<Long>> similarCategories = questionCategoryVectorRepository.searchSimilar(vector, 1);
        if (similarCategories.isEmpty()) {
            return;
        }

        QnaSet qnaSet = qnaSetRepository.findById(qnaSetId).orElse(null);
        if (qnaSet == null) {
            return;
        }

        ScoredVector<Long> bestCategory = similarCategories.get(0);
        assignCategoryByScore(qnaSet, bestCategory);
        qnaSetRepository.save(qnaSet);
    }

    private void assignCategoryByScore(QnaSet qnaSet, ScoredVector<Long> bestCategory) {
        if (bestCategory.score() < QnaSetConstant.CATEGORY_SIMILARITY_THRESHOLD) {
            qnaSet.updateCategory(null);
            log.info("질답세트 ID {} 카테고리 매칭: 유사도 임계값 미달로 카테고리 매핑 안 함 (Score: {})", qnaSet.getId(), bestCategory.score());
            return;
        }

        QnaSetCategory category =
                qnaSetCategoryRepository.findById(bestCategory.id()).orElse(null);
        qnaSet.updateCategory(category);
        log.info(
                "질답세트 ID {} 카테고리 매칭 완료 (Category ID: {}, Score: {})",
                qnaSet.getId(),
                bestCategory.id(),
                bestCategory.score());
    }
}
