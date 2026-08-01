package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.AuditLogResponseDto;
import com.dkopsidas.octopus.domain.dto.CreateAuditLogRequestDto;
import com.dkopsidas.octopus.domain.entity.AuditAction;
import com.dkopsidas.octopus.domain.entity.AuditLog;
import com.dkopsidas.octopus.mapper.AuditLogMapper;
import com.dkopsidas.octopus.repository.AuditLogRepository;
import com.dkopsidas.octopus.security.audit.AuditEvent;
import com.dkopsidas.octopus.service.AuditLogService;
import jakarta.persistence.criteria.Predicate;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;

    @Override
    @Transactional
    public AuditLogResponseDto logEvent(AuditEvent event) {
        AuditLog auditLog = new AuditLog();
        auditLog.setActorId(event.actorId());
        auditLog.setActorUsername(event.actorUsername());
        auditLog.setAction(event.action());
        auditLog.setResourceType(event.resourceType());
        auditLog.setResourceId(event.resourceId());
        auditLog.setStatus(event.status() != null ? event.status() : "SUCCESS");
        auditLog.setDetails(event.details());

        String ip = event.ipAddress() != null ? event.ipAddress() : extractClientIp();
        String userAgent = event.userAgent() != null ? event.userAgent() : extractUserAgent();
        auditLog.setIpAddress(ip);
        auditLog.setUserAgent(userAgent);

        AuditLog saved = auditLogRepository.save(auditLog);
        log.info("Audit log recorded: action={}, actor={}, status={}", saved.getAction(), saved.getActorUsername(), saved.getStatus());
        return auditLogMapper.toDto(saved);
    }

    @Override
    @Transactional
    public AuditLogResponseDto logClientEvent(
            CreateAuditLogRequestDto dto,
            UUID actorId,
            String actorUsername,
            String ipAddress,
            String userAgent
    ) {
        AuditEvent event = new AuditEvent(
                actorId,
                actorUsername,
                dto.action() != null ? dto.action() : AuditAction.CLIENT_AUDIT_EVENT,
                dto.resourceType(),
                dto.resourceId(),
                dto.status() != null ? dto.status() : "SUCCESS",
                ipAddress != null ? ipAddress : extractClientIp(),
                userAgent != null ? userAgent : extractUserAgent(),
                dto.details()
        );
        return logEvent(event);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogResponseDto> getAuditLogs(
            UUID actorId,
            AuditAction action,
            String status,
            String dateRange,
            Instant fromTimestamp,
            Instant toTimestamp,
            Pageable pageable
    ) {
        Instant effectiveFrom = fromTimestamp;
        if (effectiveFrom == null && dateRange != null && !dateRange.isBlank()) {
            Instant now = Instant.now();
            switch (dateRange.toUpperCase()) {
                case "TODAY" -> effectiveFrom = now.minus(1, ChronoUnit.DAYS);
                case "WEEK" -> effectiveFrom = now.minus(7, ChronoUnit.DAYS);
                case "MONTH" -> effectiveFrom = now.minus(30, ChronoUnit.DAYS);
                case "YEAR" -> effectiveFrom = now.minus(365, ChronoUnit.DAYS);
                default -> {}
            }
        }

        final Instant filterFrom = effectiveFrom;
        final String searchStatus = (status != null && !status.isBlank()) ? status : null;

        Specification<AuditLog> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (actorId != null) {
                predicates.add(cb.equal(root.get("actorId"), actorId));
            }
            if (action != null) {
                predicates.add(cb.equal(root.get("action"), action));
            }
            if (searchStatus != null) {
                predicates.add(cb.equal(cb.lower(root.get("status")), searchStatus.toLowerCase()));
            }
            if (filterFrom != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("timestamp"), filterFrom));
            }
            if (toTimestamp != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("timestamp"), toTimestamp));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return auditLogRepository.findAll(spec, pageable)
                .map(auditLogMapper::toDto);
    }

    private String extractClientIp() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) return null;

        HttpServletRequest request = attributes.getRequest();
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String extractUserAgent() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) return null;

        HttpServletRequest request = attributes.getRequest();
        return request.getHeader("User-Agent");
    }
}
