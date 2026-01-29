package com.shyashyashya.refit.global.property;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@ConfigurationProperties(prefix = "spring.auth")
public class AuthProperty {

    private List<String> whitelistApiUrls;
}
