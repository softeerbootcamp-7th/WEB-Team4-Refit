package com.shyashyashya.refit.global.vectordb.service;

import com.shyashyashya.refit.global.vectordb.model.SingleVectorDocument;
import com.shyashyashya.refit.global.vectordb.repository.QnaSetQuestionVectorRepository;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QnaSetQuestionVectorService {

    private final QnaSetQuestionVectorRepository qnaSetQuestionVectorRepository;

    public void processAndSave(Long dbId, List<Float> embedding, String text) {
        // 비즈니스 로직: 도메인 객체 생성
        SingleVectorDocument<Long> doc = SingleVectorDocument.of(dbId, Map.of("source", text), embedding);

        // 저장: 실제 구현체가 무엇이든 상관없음
        qnaSetQuestionVectorRepository.save(doc);
    }
}
