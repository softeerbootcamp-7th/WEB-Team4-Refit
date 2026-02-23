package com.shyashyashya.refit.batch.repository;

import com.shyashyashya.refit.batch.model.QuestionVectorDocument;
import com.shyashyashya.refit.global.property.QdrantProperty;
import com.shyashyashya.refit.global.vectordb.repository.impl.qdrant.QdrantLongSingleVectorRepository;
import io.qdrant.client.QdrantClient;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Repository;

@Repository
public class QuestionVectorRepository extends QdrantLongSingleVectorRepository<QuestionVectorDocument> {

    public QuestionVectorRepository(QdrantClient qdrantClient, QdrantProperty qdrantProperty) {
        super(qdrantClient, qdrantProperty);
    }

    @Override
    protected String getCollectionContextName() {
        return "qna-set-question";
    }

    @Override
    protected QuestionVectorDocument createSingleVectorDocument(
            Long id, Map<String, Object> payload, List<Float> vector) {
        return QuestionVectorDocument.of(id, payload, vector);
    }
}
