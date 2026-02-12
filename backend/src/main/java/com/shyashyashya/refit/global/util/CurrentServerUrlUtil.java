package com.shyashyashya.refit.global.util;

import com.shyashyashya.refit.global.model.ServerEnvironmentType;
import com.shyashyashya.refit.global.property.ActiveProfileProperty;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CurrentServerUrlUtil {

    private final ActiveProfileProperty activeProfileProperty;

    public String getServerUrl() {
        return ServerEnvironmentType.fromString(activeProfileProperty.active()).getServerUrl();
    }
}
