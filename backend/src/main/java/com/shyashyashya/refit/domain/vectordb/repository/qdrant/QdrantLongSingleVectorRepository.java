package com.shyashyashya.refit.domain.vectordb.repository.qdrant;

import com.shyashyashya.refit.domain.vectordb.model.SingleVectorDocument;
import com.shyashyashya.refit.global.property.QdrantProperty;
import io.qdrant.client.PointIdFactory;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Common;

/**
 * Id 타입이 Long인 Single Vector를 저장하는 QdrantRepository
 */
public abstract class QdrantLongSingleVectorRepository<V extends SingleVectorDocument<Long>>
        extends QdrantSingleVectorRepository<Long, V> {

    public QdrantLongSingleVectorRepository(QdrantClient qdrantClient, QdrantProperty qdrantProperty) {
        super(qdrantClient, qdrantProperty);
    }

    @Override
    protected final Common.PointId convertIdToPointId(Long id) {
        return PointIdFactory.id(id);
    }

    @Override
    protected final Long convertPointIdToId(Common.PointId pointId) {
        return pointId.getNum();
    }
}
