package com.shyashyashya.refit.global.vectordb.repository;

import com.shyashyashya.refit.global.property.QdrantProperty;
import com.shyashyashya.refit.global.vectordb.model.SingleVectorDocument;
import com.shyashyashya.refit.global.vectordb.repository.impl.qdrant.QdrantLongSingleVectorRepository;
import io.qdrant.client.QdrantClient;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Repository;

@Repository
public class QnaSetQuestionVectorRepository extends QdrantLongSingleVectorRepository<SingleVectorDocument<Long>> {

    public QnaSetQuestionVectorRepository(QdrantClient qdrantClient, QdrantProperty qdrantProperty) {
        super(qdrantClient, qdrantProperty);
    }

    @Override
    protected String getCollectionContextName() {
        return "qna-set-question";
    }

    @Override
    protected SingleVectorDocument<Long> createSingleVectorDocument(
            Long id, Map<String, Object> payload, List<Float> vector) {
        return SingleVectorDocument.of(id, payload, vector);
    }
}
