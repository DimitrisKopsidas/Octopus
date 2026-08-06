package com.dkopsidas.octopus.domain.dto;

import com.dkopsidas.octopus.domain.entity.AuditAction;
import jakarta.validation.constraints.NotNull;

public record CreateAuditLogRequestDto(
        @NotNull(message = "Action is required")
        AuditAction action,
        String resourceType,
        String resourceId,
        String status,
        String details
) {}
