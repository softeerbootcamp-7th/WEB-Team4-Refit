package com.shyashyashya.refit.global.model;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum EnvironmentType {
    TEST,
    LOCAL,
    DEV,
    MAIN;

    public static EnvironmentType fromString(String environmentType) {
        try {
            return EnvironmentType.valueOf(environmentType.toUpperCase());
        } catch (IllegalArgumentException e) {
            String availableValues =
                    Arrays.stream(EnvironmentType.values()).map(Enum::name).collect(Collectors.joining(", "));
            throw new IllegalArgumentException("Invalid environment type: " + environmentType
                    + ". Available values are: [" + availableValues + "]");
        }
    }
}
