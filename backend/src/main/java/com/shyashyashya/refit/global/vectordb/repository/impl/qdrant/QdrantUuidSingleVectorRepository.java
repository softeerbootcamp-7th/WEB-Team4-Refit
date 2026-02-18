package com.shyashyashya.refit.global.vectordb.repository.impl.qdrant;

import com.shyashyashya.refit.global.property.QdrantProperty;
import com.shyashyashya.refit.global.vectordb.model.SingleVectorDocument;
import com.shyashyashya.refit.global.vectordb.repository.impl.qdrant.base.QdrantSingleVectorRepository;
import io.qdrant.client.PointIdFactory;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Common;
import java.util.UUID;

/**
 * Id 타입이 UUID인 Single Vector를 저장하는 QdrantRepository
 */
public abstract class QdrantUuidSingleVectorRepository<V extends SingleVectorDocument<UUID>>
        extends QdrantSingleVectorRepository<UUID, V> {

    public QdrantUuidSingleVectorRepository(QdrantClient qdrantClient, QdrantProperty qdrantProperty) {
        super(qdrantClient, qdrantProperty);
    }

    @Override
    protected final Common.PointId convertIdToPointId(UUID id) {
        return PointIdFactory.id(UUID.fromString(id.toString()));
    }

    @Override
    protected final UUID convertPointIdToId(Common.PointId pointId) {
        return UUID.fromString(pointId.getUuid());
    }
}
