package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.entity.UserCode;
import com.dkopsidas.octopus.domain.entity.UserRole;
import com.dkopsidas.octopus.repository.UserCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * The registration side of invite codes: claiming one and recording who spent
 * it. Creating and listing codes is the admin panel's job and lives in
 * {@link InviteCodeManagementServiceImpl}.
 * <p>
 * The code row carries the role it grants, so HELPER and ADMIN invites share one
 * table and one claim path.
 */
@RequiredArgsConstructor
@Service
public class UserCodeService {

    private final UserCodeRepository userCodeRepository;

    /**
     * @return true if the request carried a code at all. Used to tell
     * "registering as a plain student" apart from "tried to use a code and got
     * it wrong", which deserve different responses.
     */
    public boolean isPresent(String code) {
        return code != null && !code.isBlank();
    }

    /**
     * Claims the code for a new registration, consuming it permanently.

     * Must run inside the caller's transaction: if user creation fails after
     * this point, the rollback releases the code again.
     * @return the role the code grants, or empty if the code is unknown or was
     * already consumed. The two failure cases are deliberately not
     * distinguished — telling a caller "that code exists but is taken" confirms
     * which codes are real, which is exactly what a guesser wants.
     */
    public Optional<UserRole> claim(String code) {
        if (!isPresent(code)) {
            return Optional.empty();
        }
        String trimmed = code.trim();
        if (userCodeRepository.claim(trimmed, Instant.now()) != 1) {
            return Optional.empty();
        }
        return userCodeRepository.findByCode(trimmed).map(UserCode::getRole);
    }

    /**
     * Records which account consumed a code. Separate from {@link #claim} because
     * the user id does not exist until the user row has been written; the claim
     * has to happen first so two concurrent registrations cannot both win it.
     */
    public void assignTo(String code, UUID userId) {
        userCodeRepository.findByCode(code.trim())
                .ifPresent(userCode -> userCode.setUsedBy(userId));
    }
}
