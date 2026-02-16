package com.shyashyashya.refit.domain.vectordb.model;

import java.util.Map;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
public abstract class VectorDocumentBase<K> {

    @Getter
    private K id;

    @Getter
    private Map<String, Object> payload;
}
