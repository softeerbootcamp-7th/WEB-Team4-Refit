package com.shyashyashya.refit.domain.qnaset.event;

import com.shyashyashya.refit.batch.repository.QuestionVectorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class QuestionEmbeddingDeletionEventHandler {

    private final QuestionVectorRepository questionVectorRepository;

    @Async("embeddingTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleQuestionDeletedEvent(QuestionEmbeddingDeletionEvent event) {
        log.info("질답세트 ID {}의 질문 임베딩 삭제 작업 시작", event.qnaSetId());
        try {
            questionVectorRepository.deleteById(event.qnaSetId());
            log.info("질답세트 ID {}의 임베딩 VectorDB에서 삭제 성공", event.qnaSetId());
        } catch (Throwable e) {
            log.error("질답세트 ID {}의 질문 임베딩 삭제 작업 중 오류 발생", event.qnaSetId(), e);
            throw e;
        }
    }
}
