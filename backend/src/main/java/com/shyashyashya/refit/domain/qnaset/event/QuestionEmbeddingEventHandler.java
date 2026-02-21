package com.shyashyashya.refit.domain.qnaset.event;

import com.shyashyashya.refit.batch.model.QuestionVectorDocument;
import com.shyashyashya.refit.batch.repository.QuestionVectorRepository;
import com.shyashyashya.refit.domain.qnaset.dto.event.QuestionEmbeddingEvent;
import com.shyashyashya.refit.global.gemini.GeminiClient;
import com.shyashyashya.refit.global.gemini.dto.GeminiEmbeddingRequest;
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

    @Async("embeddingTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleQuestionUpdatedEvent(QuestionEmbeddingEvent event) {
        log.info("질답세트 ID {}의 질문 임베딩 생성 작업 시작", event.qnaSetId());

        GeminiEmbeddingRequest request = GeminiEmbeddingRequest.of(
                event.updateContent(),
                GeminiEmbeddingRequest.TaskType.SEMANTIC_SIMILARITY,
                GeminiEmbeddingRequest.OutputDimensionality.valueOf(
                        questionVectorRepository.getCollectionVectorDimension()));

        geminiClient
                .sendAsyncEmbeddingRequest(request)
                .thenAccept(response -> {
                    log.info("질답세트 ID {}의 Gemini API로부터 임베딩 응답 수신 성공", event.qnaSetId());
                    questionVectorRepository.save(QuestionVectorDocument.of(
                            event.qnaSetId(),
                            event.updateContent(),
                            response.embedding().values()));
                    log.info("질답세트 ID {}의 임베딩 VectorDB에 저장 성공", event.qnaSetId());
                })
                .exceptionally(ex -> {
                    log.error("질답세트 ID {}의 질문 임베딩 생성 작업 중 오류 발생", event.qnaSetId(), ex);
                    return null;
                });
    }
}
