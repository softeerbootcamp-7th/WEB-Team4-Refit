package com.shyashyashya.refit;

import com.shyashyashya.refit.global.config.TestQdrantConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestQdrantConfig.class)
class RefitApplicationTests {

    @Test
    void contextLoads() {}
}
