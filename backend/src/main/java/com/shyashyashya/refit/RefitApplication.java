package com.shyashyashya.refit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class RefitApplication {

    public static void main(String[] args) {
        SpringApplication.run(RefitApplication.class, args);
    }
}
