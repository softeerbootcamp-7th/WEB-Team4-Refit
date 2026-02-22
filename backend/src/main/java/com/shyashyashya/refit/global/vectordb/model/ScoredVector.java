package com.shyashyashya.refit.global.vectordb.model;

import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record ScoredVector<K>(K id, Float score) {

    public static <K> ScoredVector<K> of(K id, Float score) {
        return ScoredVector.<K>builder().id(id).score(score).build();
    }
}
