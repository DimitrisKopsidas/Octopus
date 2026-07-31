package com.dkopsidas.octopus.config;

import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.domain.entity.UserRole;
import com.dkopsidas.octopus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seeds a default ADMIN user into the database if no admin exists,
 * allowing immediate login and access to the Admin Dashboard and Audit Logs.
 */
@Slf4j
@RequiredArgsConstructor
@Component
public class AdminUserSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    @Value("${app.admin.display-name:Administrator}")
    private String adminDisplayName;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        String username = adminUsername.trim();
        if (userRepository.existsByUsernameIgnoreCase(username)) {
            log.info("Admin user '{}' already exists in database.", username);
            return;
        }

        User admin = new User();
        admin.setUsername(username);
        admin.setDisplayName(adminDisplayName);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setRole(UserRole.ADMIN);
        admin.setActive(true);
        admin.setYear(1);

        userRepository.save(admin);
        log.info("Default ADMIN user seeded: username='{}', password='{}'", username, adminPassword);
    }
}
