package com.shyashyashya.refit.global.model;

import com.shyashyashya.refit.global.constant.UrlConstant;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Getter
public enum ServerEnvironmentType {
    TEST(UrlConstant.LOCAL_SERVER_URL),
    LOCAL(UrlConstant.LOCAL_SERVER_URL),
    DEV(UrlConstant.DEV_SERVER_URL),
    MAIN(UrlConstant.DEV_SERVER_URL);

    private final String serverUrl;

    public static ServerEnvironmentType fromString(String environmentType) {
        try {
            return ServerEnvironmentType.valueOf(environmentType.toUpperCase());
        } catch (IllegalArgumentException e) {
            String availableValues =
                    Arrays.stream(ServerEnvironmentType.values()).map(Enum::name).collect(Collectors.joining(", "));
            throw new IllegalArgumentException("Invalid environment type: " + environmentType
                    + ". Available values are: [" + availableValues + "]");
        }
    }
}
