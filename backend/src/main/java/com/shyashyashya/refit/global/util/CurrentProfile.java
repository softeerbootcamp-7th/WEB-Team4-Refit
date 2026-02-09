package com.shyashyashya.refit.global.util;

import static com.shyashyashya.refit.global.constant.AppConstant.DEV;
import static com.shyashyashya.refit.global.constant.AppConstant.LOCAL;

import com.shyashyashya.refit.global.constant.UrlConstant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CurrentProfile {

    @Value("${spring.profiles.active}")
    private String currentProfile;

    public String getServerUrl() {
        return switch (currentProfile) {
            case LOCAL -> UrlConstant.LOCAL_SERVER_URL;
            case DEV -> UrlConstant.DEV_SERVER_URL;
            default -> throw new IllegalStateException("Unknown profile: " + currentProfile);
        };
    }
}
