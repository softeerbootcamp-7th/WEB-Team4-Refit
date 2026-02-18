package com.shyashyashya.refit.global.vectordb.repository.qdrant;

import com.shyashyashya.refit.global.vectordb.model.SingleVectorDocument;
import com.shyashyashya.refit.global.property.QdrantProperty;
import io.qdrant.client.PointIdFactory;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Common;
import java.util.UUID;

/**
 * Id 타입이 UUID(String)인 Single Vector를 저장하는 QdrantRepository
 */
public abstract class QdrantUuidSingleVectorRepository<V extends SingleVectorDocument<String>>
        extends QdrantSingleVectorRepository<String, V> {

    public QdrantUuidSingleVectorRepository(QdrantClient qdrantClient, QdrantProperty qdrantProperty) {
        super(qdrantClient, qdrantProperty);
    }

    @Override
    protected final Common.PointId convertIdToPointId(String id) {
        return PointIdFactory.id(UUID.fromString(id));
    }

    @Override
    protected final String convertPointIdToId(Common.PointId pointId) {
        return pointId.getUuid();
    }
}
