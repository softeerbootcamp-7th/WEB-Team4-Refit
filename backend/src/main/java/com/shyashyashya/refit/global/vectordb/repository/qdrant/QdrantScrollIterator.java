package com.shyashyashya.refit.global.vectordb.repository.qdrant;

import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Common;
import io.qdrant.client.grpc.Points;
import java.time.Duration;
import java.util.Iterator;
import java.util.List;
import java.util.function.Function;

public class QdrantScrollIterator<T> implements Iterator<T> {

    private final QdrantClient qdrantClient;
    private final String collectionName;
    private final int batchSize;
    private final Duration timeout;
    private final Function<Points.RetrievedPoint, T> convertToDocumentFunction;
    private final QdrantSingleVectorRepository.QdrantBlocker blockFunction; // Repository의 block 메서드 참조

    private Iterator<T> currentBatchIterator;
    private Common.PointId nextOffset;
    private boolean hasMore;

    public QdrantScrollIterator(
            String collectionName,
            int batchSize,
            Duration timeout,
            QdrantClient qdrantClient,
            Function<Points.RetrievedPoint, T> convertToDocumentFunction,
            QdrantSingleVectorRepository.QdrantBlocker blockFunction) {
        this.collectionName = collectionName;
        this.batchSize = batchSize;
        this.timeout = timeout;
        this.qdrantClient = qdrantClient;
        this.convertToDocumentFunction = convertToDocumentFunction;
        this.blockFunction = blockFunction;
        this.currentBatchIterator = java.util.Collections.emptyIterator();
        this.hasMore = true;
    }

    @Override
    public boolean hasNext() {
        if (currentBatchIterator.hasNext()) return true;
        if (!hasMore) return false;

        fetchNextBatch();
        return currentBatchIterator.hasNext();
    }

    @Override
    public T next() {
        if (!hasNext()) throw new java.util.NoSuchElementException();
        return currentBatchIterator.next();
    }

    private void fetchNextBatch() {
        Points.ScrollPoints.Builder builder = Points.ScrollPoints.newBuilder()
                .setCollectionName(collectionName)
                .setLimit(batchSize)
                .setWithPayload(
                        Points.WithPayloadSelector.newBuilder().setEnable(true).build())
                .setWithVectors(
                        Points.WithVectorsSelector.newBuilder().setEnable(true).build());

        if (nextOffset != null) {
            builder.setOffset(nextOffset);
        }

        // Repository의 block 메서드를 사용하여 일관된 Timeout과 예외 처리 적용
        var response = blockFunction.block(
                qdrantClient.scrollAsync(builder.build(), timeout), "scrolling batch from " + collectionName);

        List<Points.RetrievedPoint> points = response.getResultList();
        this.currentBatchIterator =
                points.stream().map(convertToDocumentFunction).iterator();

        if (response.hasNextPageOffset()) {
            this.nextOffset = response.getNextPageOffset();
        } else {
            this.hasMore = false;
        }

        if (points.isEmpty()) {
            this.hasMore = false;
        }
    }
}
