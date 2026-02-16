package com.shyashyashya.refit.global.property;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "spring.vectorstore.qdrant")
@Validated
public record QdrantProperty(
        @NotBlank String host,
        @NotNull Integer port,
        @Valid @NotNull Map<String, CollectionProperty> collections) {

    public record CollectionProperty(
            @NotBlank String name,
            @NotNull Integer vectorSize,
            @NotBlank String distance) {}
}
