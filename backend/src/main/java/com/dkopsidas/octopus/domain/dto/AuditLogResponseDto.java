package com.dkopsidas.octopus.domain.dto;

import com.dkopsidas.octopus.domain.entity.AuditAction;

import java.time.Instant;
import java.util.UUID;

public record AuditLogResponseDto(
        UUID id,
        Instant timestamp,
        UUID actorId,
        String actorUsername,
        AuditAction action,
        String resourceType,
        String resourceId,
        String status,
        String ipAddress,
        String userAgent,
        String details
) {}
