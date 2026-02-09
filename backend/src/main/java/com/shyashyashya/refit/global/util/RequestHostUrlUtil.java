package com.shyashyashya.refit.global.util;

import com.shyashyashya.refit.global.constant.UrlConstant;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class RequestHostUrlUtil {

    public static final Map<String, String> ENV_URL_MAP = Map.of(
        "LOCAL_SERVER", UrlConstant.LOCAL_SERVER_URL,
        "LOCAL", UrlConstant.LOCAL_CLIENT_URL,
        "DEV_SERVER", UrlConstant.DEV_SERVER_URL,
        "DEV", UrlConstant.DEV_CLIENT_URL,
        "MAIN", UrlConstant.MAIN_CLIENT_URL
    );

    public String getRequestHostUrl(String env) {
        if (env == null || env.isBlank()) {
            return UrlConstant.LOCAL_SERVER_URL;
        }
        String result = ENV_URL_MAP.get(env.toUpperCase());
        if (result != null) {
            return result;
        }
        var allowed = String.join(", ", ENV_URL_MAP.keySet());
        throw new IllegalArgumentException("Invalid env value: " + env + ". Allowed values are: " + allowed);
    }
}
