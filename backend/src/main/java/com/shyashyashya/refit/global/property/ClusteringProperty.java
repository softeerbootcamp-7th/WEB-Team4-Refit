package com.shyashyashya.refit.global.property;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "clustering")
public record ClusteringProperty(int minPoints, int minSize) {}
