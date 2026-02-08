package com.shyashyashya.refit.global.oauth2.service.validator;

import static com.shyashyashya.refit.global.exception.ErrorCode.REQUEST_HOST_OAUTH_REDIRECTION_NOT_ALLOWED;

import com.shyashyashya.refit.global.constant.UrlConstant;
import com.shyashyashya.refit.global.exception.CustomException;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class OAuth2RedirectionHostValidator {

    private static final Set<String> allowedHosts = Set.of(
            UrlConstant.LOCAL_CLIENT_URL,
            UrlConstant.DEV_CLIENT_URL,
            UrlConstant.MAIN_CLIENT_URL,
            UrlConstant.LOCAL_SERVER_URL);

    public void validateRequestHostUrl(String requestHostUrl) {
        if (requestHostUrl == null || requestHostUrl.isBlank() || !allowedHosts.contains(requestHostUrl)) {
            throw new CustomException(REQUEST_HOST_OAUTH_REDIRECTION_NOT_ALLOWED);
        }
    }
}
