package com.shyashyashya.refit.global.config;

import com.shyashyashya.refit.global.property.VectorStoreProperty;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.QdrantGrpcClient;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Profile("!test") // test가 아닌 환경에서만 로드됨
@Configuration
@RequiredArgsConstructor
public class QdrantConfig {

    private final VectorStoreProperty vectorStoreProperty;

    @Bean
    public QdrantClient qdrantClient() {
        return new QdrantClient(QdrantGrpcClient.newBuilder(
                        vectorStoreProperty.qdrant().host(),
                        vectorStoreProperty.qdrant().port())
                .build());
    }
}
