package com.shyashyashya.refit.domain.vectordb.repository;

import com.shyashyashya.refit.domain.vectordb.model.VectorDocument;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

public interface VectorRepository<K, V extends VectorDocument<K>> {

    void save(V document);

    void saveAll(List<V> documents);

    void deleteById(K id);

    void deleteAll();

    List<K> searchSimilar(List<Float> queryVector, int topK);

    Optional<V> findById(K id);

    Stream<V> findAll();

    void updatePayload(K id, Map<String, Object> payload);
}
