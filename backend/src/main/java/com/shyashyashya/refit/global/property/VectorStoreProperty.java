package com.shyashyashya.refit.global.property;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "spring.ai.vectorstore")
@Validated
public record VectorStoreProperty(
        @NotNull Integer vectorSize, @Valid @NotNull QdrantProperty qdrant) {

    public record QdrantProperty(
            @NotBlank String host,
            @NotNull Integer port,
            @NotBlank String collectionBaseName,
            @NotBlank String distance) {}
}
