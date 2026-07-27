package com.dkopsidas.octopus.config;

import com.dkopsidas.octopus.service.impl.HelperCodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

/**
 * Copies the codes listed in {@code app.helper-codes} (env: {@code HELPER_CODES})
 * into the database on startup, skipping any that already exist.
 * <p>
 * This keeps the convenient env-var workflow while the codes themselves live in
 * the database, where "used" can be recorded. Adding a code later means adding
 * it to the variable and restarting. Removing one from the variable does NOT
 * delete it — codes are only ever added here, so a restart can never
 * resurrect an invite that has already been spent.
 */
@Slf4j
@RequiredArgsConstructor
@Component
public class HelperCodeSeeder implements ApplicationRunner {

    private final HelperCodeService helperCodeService;

    @Value("${app.helper-codes:}")
    private String rawCodes;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<String> codes = Arrays.stream(rawCodes.split(","))
                .map(String::trim)
                .filter(code -> !code.isEmpty())
                .toList();

        if (codes.isEmpty()) {
            log.info("No helper codes configured - every registration will be a STUDENT.");
            return;
        }

        codes.forEach(helperCodeService::createIfAbsent);
        log.info("Helper codes seeded: {} configured.", codes.size());
    }
}
