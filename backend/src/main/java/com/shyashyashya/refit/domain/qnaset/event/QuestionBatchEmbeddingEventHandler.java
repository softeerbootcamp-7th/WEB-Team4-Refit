package com.shyashyashya.refit.domain.qnaset.event;

import com.shyashyashya.refit.batch.model.QuestionVectorDocument;
import com.shyashyashya.refit.batch.repository.QuestionCategoryVectorRepository;
import com.shyashyashya.refit.batch.repository.QuestionVectorRepository;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetCategoryRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.global.gemini.GeminiClient;
import com.shyashyashya.refit.global.gemini.dto.GeminiBatchEmbeddingRequest;
import com.shyashyashya.refit.global.gemini.dto.GeminiBatchEmbeddingResponse;
import com.shyashyashya.refit.global.gemini.dto.GeminiEmbeddingRequest;
import com.shyashyashya.refit.global.property.ClusteringProperty;
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
public class QuestionBatchEmbeddingEventHandler {

    private final GeminiClient geminiClient;
    private final QuestionVectorRepository questionVectorRepository;
    private final QuestionCategoryVectorRepository questionCategoryVectorRepository;
    private final QnaSetRepository qnaSetRepository;
    private final ClusteringProperty clusteringProperty;
    private final QnaSetCategoryRepository qnaSetCategoryRepository;

    @Async("embeddingTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleQuestionDeletedEvent(QuestionBatchEmbeddingEvent event) {
        try {
            List<List<Float>> vectors = generateEmbeddings(event.qnaSets());
            log.info(
                    "[handleQuestionDeletedEvent] 질답세트 ID {}의 Gemini API로부터 임베딩 응답 수신 성공",
                    event.qnaSets().get(0));

            for (int i = 0; i < vectors.size(); i++) {
                QnaSet qnaSet = event.qnaSets().get(i);
                List<Float> vector = vectors.get(i);

                log.info("[handleQuestionDeletedEvent] 질답세트 ID {}의 질문 임베딩 배치 생성 작업 시작", qnaSet.getId());
                try {
                    saveQuestionVector(qnaSet.getId(), qnaSet.getQuestionText(), vector);
                    log.info("[handleQuestionDeletedEvent] 질답세트 ID {}의 임베딩 VectorDB에 저장 성공", qnaSet.getId());

                    updateCategoryIfSimilar(qnaSet.getId(), vector);
                } catch (Throwable ex) {
                    log.error(
                            "[handleQuestionDeletedEvent] 질답세트 ID {}의 질문 임베딩 생성 및 카테고리 분류 작업 중 오류 발생",
                            qnaSet.getId(),
                            ex);
                }
            }
        } catch (Throwable e) {
            log.error("[handleQuestionDeletedEvent] 질답세트들의 질문 임베딩 생성 및 카테고리 분류 작업 중 오류 발생", e);
            throw e;
        }
    }

    private List<List<Float>> generateEmbeddings(List<QnaSet> qnaSets) {
        var outputDimensionality = GeminiEmbeddingRequest.OutputDimensionality.fromValue(
                questionVectorRepository.getCollectionVectorDimension());
        var requests = new GeminiBatchEmbeddingRequest(qnaSets.stream()
                .map(qnaSet -> GeminiBatchEmbeddingRequest.GeminiEmbeddingRequest.of(
                        qnaSet.getQuestionText(),
                        GeminiEmbeddingRequest.TaskType.SEMANTIC_SIMILARITY,
                        outputDimensionality))
                .toList());
        return geminiClient.sendAsyncBatchEmbeddingRequest(requests).join().embeddings().stream()
                .map(GeminiBatchEmbeddingResponse.Embedding::values)
                .toList();
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
        if (bestCategory.score() < clusteringProperty.categorySimilarityThreshold()) {
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
