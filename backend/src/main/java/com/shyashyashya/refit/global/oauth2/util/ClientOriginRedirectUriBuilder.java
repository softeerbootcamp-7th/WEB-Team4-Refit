package com.shyashyashya.refit.global.oauth2.util;

import com.shyashyashya.refit.global.property.AuthUrlProperty;
import com.shyashyashya.refit.global.util.ClientOriginType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ClientOriginRedirectUriBuilder {

    private final AuthUrlProperty authUrlProperty;

    public String build(ClientOriginType clientOriginType) {
        return clientOriginType.getClientOriginUrl() + authUrlProperty.frontendRedirectPath();
    }
}
