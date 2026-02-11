package com.shyashyashya.refit.global.util;

import com.shyashyashya.refit.global.constant.UrlConstant;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ClientOriginType {

    LOCAL_SERVER("LOCAL_SERVER", UrlConstant.LOCAL_SERVER_URL),
    LOCAL_CLIENT("LOCAL", UrlConstant.LOCAL_CLIENT_URL),
    DEV_SERVER("DEV_SERVER", UrlConstant.DEV_SERVER_URL),
    DEV_CLIENT("DEV", UrlConstant.DEV_CLIENT_URL),
    MAIN_CLIENT("MAIN", UrlConstant.MAIN_CLIENT_URL);

    private final String originType;
    private final String clientOriginUrl;

    private static final Map<String, ClientOriginType> ORIGIN_MAP = Arrays.stream(values())
            .collect(Collectors.toUnmodifiableMap(ClientOriginType::getOriginType, Function.identity()));

    public static ClientOriginType fromOriginTypeString(String originType) {
        if (originType == null || originType.isBlank()) {
            return LOCAL_SERVER;
        }

        ClientOriginType clientOriginType = ORIGIN_MAP.get(originType.toUpperCase());
        if (clientOriginType != null) {
            return clientOriginType;
        }

        String allowedValues = String.join(", ", ORIGIN_MAP.keySet());
        throw new IllegalArgumentException(
                "Invalid origin value: " + originType + ". Allowed values are: " + allowedValues);
    }
}
