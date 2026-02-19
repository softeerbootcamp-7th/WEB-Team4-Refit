package com.shyashyashya.refit.batch.model;

import com.shyashyashya.refit.global.vectordb.model.SingleVectorDocument;
import java.util.List;
import java.util.Map;
import lombok.experimental.SuperBuilder;

@SuperBuilder
public class QuestionVectorDocument extends SingleVectorDocument<Long> {

    public static QuestionVectorDocument of(Long id, Map<String, Object> payload, List<Float> vector) {
        return QuestionVectorDocument.builder()
                .id(id)
                .payload(payload)
                .vector(vector)
                .build();
    }

    public Long getQnaSetId() {
        return this.getId();
    }

    public String getQuestion() throws Exception {
        if (!this.getPayload().containsKey("question")) {
            throw new Exception("error");
        }
        return (String) this.getPayload().get("question");
    }
}
