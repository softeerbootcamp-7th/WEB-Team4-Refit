package com.shyashyashya.refit.global.vectordb.repository;

import com.shyashyashya.refit.global.vectordb.model.ScoredVector;
import com.shyashyashya.refit.global.vectordb.model.VectorDocumentBase;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

public interface VectorRepository<K, V extends VectorDocumentBase<K>> {

    void save(V document);

    void saveAll(List<V> documents);

    void deleteById(K id);

    void deleteAll();

    List<ScoredVector<K>> searchSimilar(List<Float> queryVector, int topK);

    Optional<V> findById(K id);

    Stream<V> findAll();

    Stream<V> findAll(int batchSize);

    void updatePayload(K id, Map<String, Object> payload);
}
