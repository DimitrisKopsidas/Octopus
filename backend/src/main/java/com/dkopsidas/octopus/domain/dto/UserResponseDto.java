package com.dkopsidas.octopus.domain.dto;

import com.dkopsidas.octopus.domain.entity.DisplayPreference;
import com.dkopsidas.octopus.domain.entity.UserRole;

import java.time.Instant;
import java.util.UUID;

public record UserResponseDto(
        UUID id,
        String username,
        String displayName,
        Integer year,
        String discordName,
        DisplayPreference displayPreference,
        String publicName,
        UserRole role,
        boolean active,
        Instant created,
        Instant updated
) {}
