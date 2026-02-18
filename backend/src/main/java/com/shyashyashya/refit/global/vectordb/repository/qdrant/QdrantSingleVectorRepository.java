package com.shyashyashya.refit.global.vectordb.repository.qdrant;

import com.google.common.util.concurrent.ListenableFuture;
import com.shyashyashya.refit.global.vectordb.model.SingleVectorDocument;
import com.shyashyashya.refit.global.vectordb.repository.VectorRepository;
import com.shyashyashya.refit.global.property.QdrantProperty;
import com.shyashyashya.refit.global.property.QdrantProperty.QdrantCollectionContext;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.ValueFactory;
import io.qdrant.client.VectorsFactory;
import io.qdrant.client.grpc.Collections;
import io.qdrant.client.grpc.Common;
import io.qdrant.client.grpc.JsonWithInt;
import io.qdrant.client.grpc.Points;
import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@Slf4j
public abstract class QdrantSingleVectorRepository<K, V extends SingleVectorDocument<K>>
        implements VectorRepository<K, V> {

    private final QdrantClient qdrantClient;
    private final QdrantProperty qdrantProperty;
    private String collectionName;
    private Duration timeout;

    /**
     * Abstract method
     */
    protected abstract String getCollectionContextName();

    protected abstract V createSingleVectorDocument(K id, Map<String, Object> payload, List<Float> vector);

    protected abstract Common.PointId convertIdToPointId(K id);

    protected abstract K convertPointIdToId(Common.PointId pointId);

    /**
     * QdrantClient의 비동기 API를 동기적으로 호출하기 위한 헬퍼 메서드
     */
    // [신규] Iterator 등에서 block 메서드를 타입 안전하게 호출하기 위한 인터페이스
    @FunctionalInterface
    public interface QdrantBlocker {
        <T> T block(ListenableFuture<T> future, String description);
    }

    @PostConstruct
    public void postConstruct() {
        QdrantCollectionContext context = qdrantProperty.collections().get(getCollectionContextName());
        validateQdrantCollectionContext(context);
        this.collectionName = context.name();
        this.timeout = qdrantProperty.timeout();

        boolean collectionExists =
                block(qdrantClient.collectionExistsAsync(collectionName, timeout), "check collection existence");
        if (collectionExists) {
            log.info("Qdrant Collection '{}' already exists. Skipping creation.", collectionName);
            return;
        }

        createQdrantCollection(context);
    }

    @Override
    public void save(V document) {
        saveAll(List.of(document));
    }

    @Override
    public void saveAll(List<V> documents) {
        if (documents.isEmpty()) {
            return;
        }

        List<Points.PointStruct> points =
                documents.stream().map(this::convertToPointStruct).collect(Collectors.toList());

        block(qdrantClient.upsertAsync(collectionName, points, timeout), "upsert points");
    }

    @Override
    public void deleteById(K id) {
        Common.PointId pointId = convertIdToPointId(id);
        block(qdrantClient.deleteAsync(collectionName, List.of(pointId), timeout), "delete point by ID: " + id);
    }

    @Override
    public void deleteAll() {
        // 1. 조건 없는 '빈 필터' 생성 (== 모든 데이터 선택)
        Common.Filter matchAllFilter = Common.Filter.getDefaultInstance();

        // 2. 포인트 선택자(Selector)에 필터 장착
        Points.PointsSelector pointsSelector =
                Points.PointsSelector.newBuilder().setFilter(matchAllFilter).build();

        Points.DeletePoints deleteRequest = Points.DeletePoints.newBuilder()
                .setCollectionName(collectionName)
                .setPoints(pointsSelector)
                .setWait(false) // 비동기 삭제 요청
                .build();

        // 3. 삭제 요청 (wait=false 기본값, 비동기 인덱싱)
        block(qdrantClient.deleteAsync(deleteRequest, timeout), "delete all points in collection");
    }

    @Override
    public List<K> searchSimilar(List<Float> queryVector, int topK) {
        Points.SearchPoints searchPoints = Points.SearchPoints.newBuilder()
                .setCollectionName(collectionName)
                .addAllVector(queryVector)
                .setLimit(topK)
                .setWithPayload(
                        Points.WithPayloadSelector.newBuilder().setEnable(false).build())
                .build();

        List<Points.ScoredPoint> results =
                block(qdrantClient.searchAsync(searchPoints, timeout), "search similar points (top " + topK + ")");

        return results.stream()
                .map(scoredPoint -> convertPointIdToId(scoredPoint.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<V> findById(K id) {
        Common.PointId pointId = convertIdToPointId(id);

        List<Points.RetrievedPoint> results = block(
                qdrantClient.retrieveAsync(
                        collectionName,
                        List.of(pointId),
                        Points.WithPayloadSelector.newBuilder().setEnable(true).build(),
                        Points.WithVectorsSelector.newBuilder().setEnable(true).build(),
                        null,
                        timeout),
                "retrieve point by ID: " + id);

        if (results.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(convertToDocument(results.get(0)));
    }

    @Override
    public Stream<V> findAll(int batchSize) {
        Iterator<V> iterator = new QdrantScrollIterator<>(
                collectionName, batchSize, timeout, qdrantClient, this::convertToDocument, this::block);

        return StreamSupport.stream(
                Spliterators.spliteratorUnknownSize(iterator, Spliterator.ORDERED | Spliterator.NONNULL), false);
    }

    @Override
    public Stream<V> findAll() {
        return findAll(qdrantProperty.findAllDefaultBatchSize());
    }

    @Override
    public void updatePayload(K id, Map<String, Object> metadata) {
        if (metadata == null || metadata.isEmpty()) {
            return;
        }

        Map<String, JsonWithInt.Value> qdrantPayload = metadata.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, entry -> toQdrantValue(entry.getValue())));

        Points.PointsSelector pointsSelector = Points.PointsSelector.newBuilder()
                .setPoints(Points.PointsIdsList.newBuilder()
                        .addIds(convertIdToPointId(id))
                        .build())
                .build();

        Points.SetPayloadPoints request = Points.SetPayloadPoints.newBuilder()
                .setCollectionName(collectionName)
                .putAllPayload(qdrantPayload)
                .setPointsSelector(pointsSelector)
                .setWait(false)
                .build();

        block(qdrantClient.setPayloadAsync(request, timeout), "update payload for point ID: " + id);
    }

    private <T> T block(ListenableFuture<T> future, String operationDescription) {
        try {
            return future.get();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Thread interrupted while: {}", operationDescription, e);
            throw new RuntimeException("Thread interrupted while: " + operationDescription, e);

        } catch (ExecutionException e) {
            Throwable cause = e.getCause();
            log.error(
                    "Qdrant operation failed during: {} (Reason: {})", operationDescription, cause.getMessage(), cause);
            throw new RuntimeException("Qdrant operation failed [" + operationDescription + "]", cause);
        }
    }

    private void validateQdrantCollectionContext(QdrantCollectionContext qdrantCollectionContext) {
        if (qdrantCollectionContext == null) {
            log.error("Qdrant Collection Context '{}' is missing", getCollectionContextName());
            throw new IllegalStateException("Qdrant collection context is missing");
        }
    }

    private void createQdrantCollection(QdrantCollectionContext qdrantCollectionContext) {
        log.info("Creating Qdrant Collection: {}", collectionName);
        Collections.VectorParams vectorParams = Collections.VectorParams.newBuilder()
                .setSize(qdrantCollectionContext.vectorDimension())
                .setDistance(qdrantCollectionContext.distance())
                .build();

        Collections.CreateCollection createCollectionRequest = Collections.CreateCollection.newBuilder()
                .setCollectionName(collectionName)
                .setVectorsConfig(Collections.VectorsConfig.newBuilder()
                        .setParams(vectorParams)
                        .build())
                .setOnDiskPayload(true) // Payload를 디스크에 저장하여 RAM 사용량 최적화
                .build();

        block(qdrantClient.createCollectionAsync(createCollectionRequest, timeout), "create collection");
        log.info("Qdrant Collection '{}' created successfully.", collectionName);
    }

    // point.getVectors().getVector().getDataList()가 deprecated 되었는데, 대체 메서드를 찾지 못해서 그대로 사용함.
    @SuppressWarnings("deprecation")
    private V convertToDocument(Points.RetrievedPoint point) {
        K id = convertPointIdToId(point.getId());

        Map<String, Object> payload = point.getPayloadMap().entrySet().stream()
                .collect(
                        HashMap::new,
                        (map, entry) -> map.put(entry.getKey(), fromQdrantValue(entry.getValue())),
                        HashMap::putAll);

        List<Float> vector = point.getVectors().getVector().getDataList();
        return createSingleVectorDocument(id, payload, vector);
    }

    private Points.PointStruct convertToPointStruct(V doc) {
        Map<String, JsonWithInt.Value> payload = doc.getPayload().entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, entry -> toQdrantValue(entry.getValue())));

        return Points.PointStruct.newBuilder()
                .setId(convertIdToPointId(doc.getId()))
                .setVectors(VectorsFactory.vectors(doc.getVector()))
                .putAllPayload(payload)
                .build();
    }

    private Object fromQdrantValue(JsonWithInt.Value value) {
        if (value.hasNullValue()) return null;
        if (value.hasStringValue()) return value.getStringValue();
        if (value.hasIntegerValue()) return value.getIntegerValue(); // Long 타입 반환됨
        if (value.hasDoubleValue()) return value.getDoubleValue();
        if (value.hasBoolValue()) return value.getBoolValue();
        if (value.hasListValue()) {
            return value.getListValue().getValuesList().stream()
                    .map(this::fromQdrantValue)
                    .collect(Collectors.toList());
        }
        if (value.hasStructValue()) {
            return value.getStructValue().getFieldsMap().entrySet().stream()
                    .collect(
                            HashMap::new,
                            (map, entry) -> map.put(entry.getKey(), fromQdrantValue(entry.getValue())),
                            HashMap::putAll);
        }

        return value.toString();
    }

    private JsonWithInt.Value toQdrantValue(Object v) {
        if (v == null) return ValueFactory.nullValue();
        if (v instanceof String s) return ValueFactory.value(s);
        if (v instanceof Integer i) return ValueFactory.value(i);
        if (v instanceof Long l) return ValueFactory.value(l);
        if (v instanceof Double d) return ValueFactory.value(d);
        if (v instanceof Float f) return ValueFactory.value(f.doubleValue()); // Float 지원 추가
        if (v instanceof Boolean b) return ValueFactory.value(b);
        if (v instanceof List<?> list) {
            List<JsonWithInt.Value> values =
                    list.stream().map(this::toQdrantValue).collect(Collectors.toList());
            return ValueFactory.list(values);
        }
        if (v instanceof Map<?, ?> map) {
            Map<String, JsonWithInt.Value> mapValue = new HashMap<>();
            map.forEach((k, val) -> mapValue.put(String.valueOf(k), toQdrantValue(val)));
            return ValueFactory.value(mapValue);
        }

        throw new RuntimeException(
                "Unsupported payload value type: " + v.getClass().getName());
    }
}
