package com.dkopsidas.octopus.domain.dto;

import com.dkopsidas.octopus.domain.entity.UserRole;
import java.time.Instant;

public record CommunityActivityDto(
        String id,
        String type,
        String username,
        String displayName,
        UserRole role,
        String badgeCode,
        Integer tier,
        String title,
        Instant timestamp
) {}
