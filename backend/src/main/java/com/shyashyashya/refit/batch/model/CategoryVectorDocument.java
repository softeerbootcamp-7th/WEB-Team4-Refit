package com.shyashyashya.refit.batch.model;

import com.shyashyashya.refit.global.vectordb.model.SingleVectorDocument;
import java.util.List;
import java.util.Map;
import lombok.experimental.SuperBuilder;

@SuperBuilder
public class CategoryVectorDocument extends SingleVectorDocument<Long> {

    public static CategoryVectorDocument of(Long clusterId, List<Float> centroidVector, Map<String, Object> payload) {
        return CategoryVectorDocument.builder()
                .id(clusterId)
                .vector(centroidVector)
                .payload(payload)
                .build();
    }

    public List<Long> getQuestionDocumentIds() {
        return (List<Long>) this.getPayload().get("clusterDocumentIds");
    }

    public List<Float> getCentroidVector() {
        return this.getVector();
    }
}
