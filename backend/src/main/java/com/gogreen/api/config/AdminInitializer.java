package com.gogreen.api.config;

import com.gogreen.api.entity.Nursery;
import com.gogreen.api.entity.Role;
import com.gogreen.api.entity.User;
import com.gogreen.api.repository.NurseryRepository;
import com.gogreen.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final NurseryRepository nurseryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // Ensure Admin user exists with correct password
        Optional<User> adminOpt = userRepository.findByUsername("admin");
        if (adminOpt.isEmpty()) {
            User admin = User.builder()
                    .name("System Admin")
                    .username("admin")
                    .email("admin@gogreen.com")
                    .password(passwordEncoder.encode("AdminPassword123"))
                    .role(Role.ROLE_ADMIN)
                    .enabled(true)
                    .emailVerified(true)
                    .build();
            userRepository.save(admin);
            log.info("Initial Admin user created with username 'admin'");
        } else {
            User admin = adminOpt.get();
            admin.setPassword(passwordEncoder.encode("AdminPassword123"));
            admin.setEnabled(true);
            userRepository.save(admin);
            log.info("Admin user password verified/reset to 'AdminPassword123'");
        }

        // Ensure Nursery Owner exists with correct password
        Optional<User> ownerOpt = userRepository.findByUsername("nursery_owner");
        User owner;
        if (ownerOpt.isEmpty()) {
            owner = User.builder()
                    .name("Nursery Owner")
                    .username("nursery_owner")
                    .email("owner@gogreen.com")
                    .password(passwordEncoder.encode("Owner@1234"))
                    .role(Role.ROLE_NURSERY_OWNER)
                    .enabled(true)
                    .emailVerified(true)
                    .build();
            owner = userRepository.save(owner);
            log.info("Initial Nursery Owner user created with username 'nursery_owner'");
        } else {
            owner = ownerOpt.get();
            owner.setPassword(passwordEncoder.encode("Owner@1234"));
            owner.setRole(Role.ROLE_NURSERY_OWNER);
            owner.setEnabled(true);
            owner.setEmailVerified(true);
            owner = userRepository.save(owner);
            log.info("Nursery Owner user password verified/reset to 'Owner@1234'");
        }

        // Ensure Nursery Profile exists
        if (nurseryRepository.findFirstByUserId(owner.getId()).isEmpty()) {
            Nursery nursery = Nursery.builder()
                    .user(owner)
                    .name("GoGreen Central Nursery")
                    .description("Official GoGreen AI Nursery")
                    .address("123 Green Valley Road")
                    .city("Ecoville")
                    .postalCode("10001")
                    .contactEmail("owner@gogreen.com")
                    .contactPhone("+1 555-0199")
                    .build();
            nurseryRepository.save(nursery);
            log.info("Created default Nursery profile for 'nursery_owner'");
        }
    }
}
