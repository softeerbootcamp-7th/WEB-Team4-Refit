package com.shyashyashya.refit.global.config;

import com.shyashyashya.refit.global.util.KeyLockUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeyLockUtilConfig {

    @Bean("stringKeyLockUtil")
    KeyLockUtil<String> stringKeyLockUtil() {
        return new KeyLockUtil<>();
    }

    @Bean("interviewKeyLockUtil")
    KeyLockUtil<Long> longKeyLockUtil() {
        return new KeyLockUtil<>();
    }
}
