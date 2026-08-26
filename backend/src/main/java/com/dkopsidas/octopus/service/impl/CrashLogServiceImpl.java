package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.CrashLogResponseDto;
import com.dkopsidas.octopus.domain.dto.CreateCrashLogRequestDto;
import com.dkopsidas.octopus.domain.entity.CrashLog;
import com.dkopsidas.octopus.mapper.CrashLogMapper;
import com.dkopsidas.octopus.repository.CrashLogRepository;
import com.dkopsidas.octopus.service.CrashLogService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CrashLogServiceImpl implements CrashLogService {

    private final CrashLogRepository crashLogRepository;
    private final CrashLogMapper crashLogMapper;

    @Override
    @Transactional
    public CrashLogResponseDto logCrash(
            Throwable throwable,
            String requestUri,
            String httpMethod,
            Integer statusCode,
            UUID actorId,
            String actorUsername,
            String ipAddress,
            String userAgent
    ) {
        CrashLog crashLog = new CrashLog();
        crashLog.setExceptionClass(throwable.getClass().getName());
        crashLog.setMessage(throwable.getMessage());
        crashLog.setStackTrace(getStackTraceAsString(throwable));
        crashLog.setRequestUri(requestUri);
        crashLog.setHttpMethod(httpMethod);
        crashLog.setStatusCode(statusCode != null ? statusCode : 500);
        crashLog.setActorId(actorId != null ? actorId : currentActorId());
        crashLog.setActorUsername(actorUsername != null ? actorUsername : currentActorUsername());
        crashLog.setIpAddress(ipAddress != null ? ipAddress : extractClientIp());
        crashLog.setUserAgent(userAgent != null ? userAgent : extractUserAgent());
        crashLog.setResolved(false);

        CrashLog saved = crashLogRepository.save(crashLog);
        log.error("Crash log recorded: exception={}, uri={}, actor={}", saved.getExceptionClass(), saved.getRequestUri(), saved.getActorUsername());
        return crashLogMapper.toDto(saved);
    }

    @Override
    @Transactional
    public CrashLogResponseDto logClientCrash(
            CreateCrashLogRequestDto dto,
            UUID actorId,
            String actorUsername,
            String ipAddress,
            String userAgent
    ) {
        CrashLog crashLog = new CrashLog();
        crashLog.setExceptionClass(dto.exceptionClass());
        crashLog.setMessage(dto.message());
        crashLog.setStackTrace(dto.stackTrace());
        crashLog.setRequestUri(dto.requestUri());
        crashLog.setHttpMethod(dto.httpMethod() != null ? dto.httpMethod() : "CLIENT");
        crashLog.setStatusCode(dto.statusCode() != null ? dto.statusCode() : 500);
        crashLog.setActorId(actorId != null ? actorId : currentActorId());
        crashLog.setActorUsername(actorUsername != null ? actorUsername : currentActorUsername());
        crashLog.setIpAddress(ipAddress != null ? ipAddress : extractClientIp());
        crashLog.setUserAgent(userAgent != null ? userAgent : extractUserAgent());
        crashLog.setResolved(false);

        CrashLog saved = crashLogRepository.save(crashLog);
        log.error("Client crash log recorded: exception={}, uri={}, actor={}", saved.getExceptionClass(), saved.getRequestUri(), saved.getActorUsername());
        return crashLogMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CrashLogResponseDto> getCrashLogs(
            String exceptionClass,
            Boolean resolved,
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
        final String searchException = (exceptionClass != null && !exceptionClass.isBlank()) ? exceptionClass : null;

        Specification<CrashLog> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (searchException != null) {
                predicates.add(cb.like(cb.lower(root.get("exceptionClass")), "%" + searchException.toLowerCase() + "%"));
            }
            if (resolved != null) {
                predicates.add(cb.equal(root.get("resolved"), resolved));
            }
            if (filterFrom != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("timestamp"), filterFrom));
            }
            if (toTimestamp != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("timestamp"), toTimestamp));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return crashLogRepository.findAll(spec, pageable)
                .map(crashLogMapper::toDto);
    }

    @Override
    @Transactional
    public CrashLogResponseDto markAsResolved(UUID id, boolean resolved) {
        CrashLog crashLog = crashLogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Crash log not found with ID: " + id));
        crashLog.setResolved(resolved);
        CrashLog saved = crashLogRepository.save(crashLog);
        log.info("Crash log ID {} marked as resolved={}", id, resolved);
        return crashLogMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnresolved() {
        return crashLogRepository.countByResolvedFalse();
    }

    private String getStackTraceAsString(Throwable throwable) {
        if (throwable == null) return null;
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        throwable.printStackTrace(pw);
        return sw.toString();
    }

    private UUID currentActorId() {
        Jwt jwt = currentJwt();
        if (jwt == null || jwt.getSubject() == null) return null;
        try {
            return UUID.fromString(jwt.getSubject());
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }

    private String currentActorUsername() {
        Jwt jwt = currentJwt();
        return jwt != null ? jwt.getClaimAsString("username") : null;
    }

    private Jwt currentJwt() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) return null;
        return authentication.getPrincipal() instanceof Jwt jwt ? jwt : null;
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
