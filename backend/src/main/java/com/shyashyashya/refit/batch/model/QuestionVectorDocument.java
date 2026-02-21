package com.shyashyashya.refit.batch.model;

import static com.shyashyashya.refit.global.constant.ClusteringConstant.QUESTION_VECTOR_QUESTION_KEY;

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

    public static QuestionVectorDocument of(Long id, String question, List<Float> vector) {
        return QuestionVectorDocument.builder()
                .id(id)
                .payload(Map.of(QUESTION_VECTOR_QUESTION_KEY, question))
                .vector(vector)
                .build();
    }

    public Long getQnaSetId() {
        return this.getId();
    }

    public String getQuestion() {
        if (!this.getPayload().containsKey(QUESTION_VECTOR_QUESTION_KEY)) {
            throw new RuntimeException("[getQuestion] question 필드가 QuestionVectorDocument Payload 안에 없습니다.");
        }
        return (String) this.getPayload().get(QUESTION_VECTOR_QUESTION_KEY);
    }
}
