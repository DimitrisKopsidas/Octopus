package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.CrashLogResponseDto;
import com.dkopsidas.octopus.domain.dto.CreateCrashLogRequestDto;
import com.dkopsidas.octopus.service.CrashLogService;
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
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class CrashLogController {

    private final CrashLogService crashLogService;

    @PostMapping("/logs/crash")
    public ResponseEntity<CrashLogResponseDto> createClientCrashLog(
            @Valid @RequestBody CreateCrashLogRequestDto requestDto,
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest request
    ) {
        UUID actorId = jwt != null ? UUID.fromString(jwt.getSubject()) : null;
        String actorUsername = jwt != null ? jwt.getClaimAsString("username") : null;
        String ipAddress = extractIp(request);
        String userAgent = request.getHeader("User-Agent");

        CrashLogResponseDto response = crashLogService.logClientCrash(
                requestDto,
                actorId,
                actorUsername,
                ipAddress,
                userAgent
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/crash-logs")
    public ResponseEntity<Page<CrashLogResponseDto>> getCrashLogs(
            @RequestParam(required = false) String exceptionClass,
            @RequestParam(required = false) Boolean resolved,
            @RequestParam(required = false) String dateRange,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fromTimestamp,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant toTimestamp,
            @PageableDefault(size = 20, sort = "timestamp", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<CrashLogResponseDto> logs = crashLogService.getCrashLogs(
                exceptionClass,
                resolved,
                dateRange,
                fromTimestamp,
                toTimestamp,
                pageable
        );
        return ResponseEntity.ok(logs);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/crash-logs/{id}/resolve")
    public ResponseEntity<CrashLogResponseDto> markAsResolved(
            @PathVariable UUID id,
            @RequestBody Map<String, Boolean> body
    ) {
        boolean resolved = body.getOrDefault("resolved", true);
        CrashLogResponseDto updated = crashLogService.markAsResolved(id, resolved);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/crash-logs/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long unresolvedCount = crashLogService.countUnresolved();
        return ResponseEntity.ok(Map.of("unresolvedCount", unresolvedCount));
    }

    private String extractIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
