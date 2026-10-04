package com.gogreen.api.config;

import com.gogreen.api.entity.Role;
import com.gogreen.api.entity.User;
import com.gogreen.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByRole(Role.ROLE_ADMIN)) {
            User admin = User.builder()
                    .name("System Admin")
                    .username("admin")
                    .email("admin@gogreen.com")
                    .password(passwordEncoder.encode("AdminPassword123"))
                    .role(Role.ROLE_ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Initial Admin user created successfully with username 'admin'");
        } else {
            log.info("Admin user already exists in system.");
        }
    }
}
