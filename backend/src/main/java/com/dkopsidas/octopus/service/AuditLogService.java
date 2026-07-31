package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.AuditLogResponseDto;
import com.dkopsidas.octopus.domain.dto.CreateAuditLogRequestDto;
import com.dkopsidas.octopus.domain.entity.AuditAction;
import com.dkopsidas.octopus.security.audit.AuditEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.UUID;

public interface AuditLogService {

    AuditLogResponseDto logEvent(AuditEvent event);

    AuditLogResponseDto logClientEvent(
            CreateAuditLogRequestDto dto,
            UUID actorId,
            String actorUsername,
            String ipAddress,
            String userAgent
    );

    Page<AuditLogResponseDto> getAuditLogs(
            UUID actorId,
            AuditAction action,
            String status,
            String dateRange,
            Instant fromTimestamp,
            Instant toTimestamp,
            Pageable pageable
    );
}
