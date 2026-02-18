package com.shyashyashya.refit.global.vectordb.model;

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
