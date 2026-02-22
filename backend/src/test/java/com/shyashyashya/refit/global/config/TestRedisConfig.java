package com.shyashyashya.refit.global.config;

import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.ValueOperations;

@TestConfiguration
public class TestRedisConfig {

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return Mockito.mock(RedisConnectionFactory.class);
    }

    @Bean
    @SuppressWarnings({ "unchecked", "rawtypes" })
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> mockTemplate = Mockito.mock(RedisTemplate.class);
        ValueOperations valueOps = Mockito.mock(ValueOperations.class);
        SetOperations setOps = Mockito.mock(SetOperations.class);

        Mockito.when(mockTemplate.opsForValue()).thenReturn(valueOps);
        Mockito.when(mockTemplate.opsForSet()).thenReturn(setOps);

        return mockTemplate;
    }
}
