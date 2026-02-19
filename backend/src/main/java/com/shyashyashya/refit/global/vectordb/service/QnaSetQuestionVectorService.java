package com.shyashyashya.refit.global.vectordb.service;

import com.shyashyashya.refit.global.vectordb.model.SingleVectorDocument;
import com.shyashyashya.refit.global.vectordb.repository.QnaSetQuestionVectorRepository;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * QnaSetQuestionVectorRepository를 주입받아서 어떻게 사용하는지 보여주는 예시 서비스
 * 추후 삭제 가능
 */
@Service
@RequiredArgsConstructor
public class QnaSetQuestionVectorService {

    private final QnaSetQuestionVectorRepository qnaSetQuestionVectorRepository;

    public void processAndSave(Long dbId, List<Float> embedding, String text) {
        SingleVectorDocument<Long> doc = SingleVectorDocument.of(dbId, Map.of("source", text), embedding);
        qnaSetQuestionVectorRepository.save(doc);
    }
}
