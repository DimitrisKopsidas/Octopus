package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.AuditLogResponseDto;
import com.dkopsidas.octopus.domain.dto.CreateAuditLogRequestDto;
import com.dkopsidas.octopus.domain.entity.AuditAction;
import com.dkopsidas.octopus.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @PostMapping("/logs/audit")
    public ResponseEntity<AuditLogResponseDto> createClientAuditLog(
            @Valid @RequestBody CreateAuditLogRequestDto requestDto,
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest request
    ) {
        UUID actorId = jwt != null ? UUID.fromString(jwt.getSubject()) : null;
        String actorUsername = jwt != null ? jwt.getClaimAsString("username") : null;
        String ipAddress = extractIp(request);
        String userAgent = request.getHeader("User-Agent");

        AuditLogResponseDto response = auditLogService.logClientEvent(
                requestDto,
                actorId,
                actorUsername,
                ipAddress,
                userAgent
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/audit-logs")
    public ResponseEntity<Page<AuditLogResponseDto>> getAuditLogs(
            @RequestParam(required = false) UUID actorId,
            @RequestParam(required = false) AuditAction action,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String dateRange,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fromTimestamp,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant toTimestamp,
            @PageableDefault(size = 20, sort = "timestamp", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AuditLogResponseDto> logs = auditLogService.getAuditLogs(
                actorId,
                action,
                status,
                dateRange,
                fromTimestamp,
                toTimestamp,
                pageable
        );
        return ResponseEntity.ok(logs);
    }

    private String extractIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
