package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.CrashLogResponseDto;
import com.dkopsidas.octopus.domain.dto.CreateCrashLogRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.UUID;

public interface CrashLogService {

    CrashLogResponseDto logCrash(
            Throwable throwable,
            String requestUri,
            String httpMethod,
            Integer statusCode,
            UUID actorId,
            String actorUsername,
            String ipAddress,
            String userAgent
    );

    CrashLogResponseDto logClientCrash(
            CreateCrashLogRequestDto dto,
            UUID actorId,
            String actorUsername,
            String ipAddress,
            String userAgent
    );

    Page<CrashLogResponseDto> getCrashLogs(
            String exceptionClass,
            Boolean resolved,
            String dateRange,
            Instant fromTimestamp,
            Instant toTimestamp,
            Pageable pageable
    );

    CrashLogResponseDto markAsResolved(UUID id, boolean resolved);

    long countUnresolved();
}
