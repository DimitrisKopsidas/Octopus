package com.dkopsidas.octopus.security.audit;

import com.dkopsidas.octopus.domain.entity.AuditAction;

import java.util.UUID;

public record AuditEvent(
        UUID actorId,
        String actorUsername,
        AuditAction action,
        String resourceType,
        String resourceId,
        String status,
        String ipAddress,
        String userAgent,
        String details
) {
    public static AuditEvent success(UUID actorId, String actorUsername, AuditAction action, String resourceType, String resourceId, String details) {
        return new AuditEvent(actorId, actorUsername, action, resourceType, resourceId, "SUCCESS", null, null, details);
    }

    public static AuditEvent failure(UUID actorId, String actorUsername, AuditAction action, String resourceType, String resourceId, String details) {
        return new AuditEvent(actorId, actorUsername, action, resourceType, resourceId, "FAILURE", null, null, details);
    }
}
