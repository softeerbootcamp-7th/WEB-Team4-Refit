package com.shyashyashya.refit.global.util;

import com.shyashyashya.refit.global.constant.UrlConstant;
import com.shyashyashya.refit.global.model.EnvironmentType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CurrentProfileUtil {

    @Value("${spring.profiles.active}")
    private String currentProfile;

    public String getServerUrl() {
        return switch (EnvironmentType.fromString(currentProfile)) {
            case TEST, LOCAL -> UrlConstant.LOCAL_SERVER_URL;
            case DEV -> UrlConstant.DEV_SERVER_URL;
            default -> throw new IllegalStateException("Unknown profile: " + currentProfile);
        };
    }
}
