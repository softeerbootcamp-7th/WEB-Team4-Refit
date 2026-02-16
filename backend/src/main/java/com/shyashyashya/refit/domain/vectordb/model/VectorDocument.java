package com.shyashyashya.refit.domain.vectordb.model;

import java.util.Map;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
public abstract class VectorDocument<K> {

    @Getter
    protected K id;

    @Getter
    protected Map<String, Object> payload;
}
