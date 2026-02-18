package com.shyashyashya.refit.global.vectordb.model;

import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
public class SingleVectorDocument<K> extends VectorDocumentBase<K> {

    @Getter
    private List<Float> vector;

    public static <K> SingleVectorDocument<K> of(K id, Map<String, Object> payload, List<Float> vector) {
        return SingleVectorDocument.<K>builder()
                .id(id)
                .payload(payload)
                .vector(vector)
                .build();
    }
}
