package com.shyashyashya.refit.batch.repository;

import com.shyashyashya.refit.batch.model.CategoryVectorDocument;
import com.shyashyashya.refit.global.property.QdrantProperty;
import com.shyashyashya.refit.global.vectordb.repository.impl.qdrant.QdrantLongSingleVectorRepository;
import io.qdrant.client.QdrantClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class QuestionCategoryVectorRepository extends QdrantLongSingleVectorRepository<CategoryVectorDocument> {

    public QuestionCategoryVectorRepository(QdrantClient qdrantClient, QdrantProperty qdrantProperty) {
        super(qdrantClient, qdrantProperty);
    }

    @Override
    protected String getCollectionContextName() {
        return "qna-set-category";
    }

    @Override
    protected CategoryVectorDocument createSingleVectorDocument(Long id, Map<String, Object> payload, List<Float> vector) {
        return CategoryVectorDocument.of(id, vector, payload);
    }
}
