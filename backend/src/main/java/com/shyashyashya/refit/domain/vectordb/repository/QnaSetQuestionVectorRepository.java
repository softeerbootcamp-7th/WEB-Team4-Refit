package com.shyashyashya.refit.domain.vectordb.repository;

import com.shyashyashya.refit.global.property.QdrantProperty;
import io.qdrant.client.QdrantClient;
import org.springframework.stereotype.Repository;

@Repository
public class QnaSetQuestionVectorRepository extends QdrantSingleVectorRepository {

    public QnaSetQuestionVectorRepository(QdrantClient qdrantClient, QdrantProperty qdrantProperty) {
        super(qdrantClient, qdrantProperty);
    }

    @Override
    protected String getCollectionContextName() {
        return "qna-set-question";
    }
}
