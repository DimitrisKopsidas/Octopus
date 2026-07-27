package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.entity.HelperCode;
import com.dkopsidas.octopus.repository.HelperCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

/**
 * Single-use invite codes that let a registration become a HELPER.
 */
@RequiredArgsConstructor
@Service
public class HelperCodeService {

    private final HelperCodeRepository helperCodeRepository;

    /**
     * @return true if the request carried a code at all. Used to tell
     * "registering as a plain student" apart from "tried to be a helper and got
     * the code wrong", which deserve different responses.
     */
    public boolean isPresent(String code) {
        return code != null && !code.isBlank();
    }

    /**
     * Claims the code for a new registration, consuming it permanently.

     * Must run inside the caller's transaction: if user creation fails after
     * this point, the rollback releases the code again. 
     * @return true if this call successfully claimed the code; false if the code
     * is unknown or was already consumed. The two failure cases are deliberately
     * not distinguished — telling a caller "that code exists but is taken"
     * confirms which codes are real, which is exactly what a guesser wants.
     */
    public boolean claim(String code) {
        if (!isPresent(code)) {
            return false;
        }
        return helperCodeRepository.claim(code.trim(), Instant.now()) == 1;
    }

    /**
     * Records which account consumed a code. Separate from {@link #claim} because
     * the user id does not exist until the user row has been written; the claim
     * has to happen first so two concurrent registrations cannot both win it.
     */
    public void assignTo(String code, UUID userId) {
        helperCodeRepository.findByCode(code.trim())
                .ifPresent(helperCode -> helperCode.setUsedBy(userId));
    }

    /**
     * Adds a code if it is not already stored. Used by the startup seeder;
     * existing codes — including consumed ones — are left untouched.
     */
    public void createIfAbsent(String code) {
        if (helperCodeRepository.existsByCode(code)) {
            return;
        }
        HelperCode helperCode = new HelperCode();
        helperCode.setCode(code);
        helperCodeRepository.save(helperCode);
    }
}
