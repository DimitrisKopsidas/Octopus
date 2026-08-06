package com.dkopsidas.octopus.domain.dto;

import com.dkopsidas.octopus.domain.entity.UserRole;

import java.time.Instant;
import java.util.UUID;

/**
 * An invite code as the admin panel sees it. {@code usedAt} doubles as the
 * availability flag: null means the code is still claimable.
 */
public record InviteCodeResponseDto(
        Long id,
        String code,
        UserRole targetRole,
        Instant usedAt,
        UUID usedBy,
        String usedByUsername,
        Instant created
) {}
