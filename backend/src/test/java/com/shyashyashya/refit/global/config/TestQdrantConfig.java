package com.shyashyashya.refit.global.config;

import com.google.common.util.concurrent.Futures;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Collections;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

@TestConfiguration
public class TestQdrantConfig {

    @Bean
    @Primary
    public QdrantClient qdrantClient() {
        QdrantClient mockClient = Mockito.mock(QdrantClient.class);

        Mockito.when(mockClient.listCollectionsAsync())
                .thenReturn(Futures.immediateFuture(List.of("existing_collection")));
        Mockito.when(mockClient.createCollectionAsync(anyString(), any(Collections.VectorParams.class)))
                .thenReturn(Futures.immediateFuture(Collections.CollectionOperationResponse.newBuilder().build()));

        return mockClient;
    }
}
