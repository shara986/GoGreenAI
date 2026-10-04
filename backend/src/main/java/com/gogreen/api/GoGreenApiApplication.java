package com.gogreen.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GoGreenApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(GoGreenApiApplication.class, args);
    }
}
