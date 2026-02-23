package com.shyashyashya.refit.global.property;

import io.qdrant.client.grpc.Collections;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "spring.vectorstore.qdrant")
@Validated
public record QdrantProperty(
        @NotBlank String host,
        @NotNull Integer port,
        @NotNull Duration timeout,
        @NotNull @Min(2) Integer findAllDefaultBatchSize,
        @Valid @NotNull Map<String, QdrantCollectionContext> collections) {

    public record QdrantCollectionContext(
            @NotBlank String name,
            @NotNull Integer vectorDimension,
            @NotNull Collections.Distance distance) {}
}
