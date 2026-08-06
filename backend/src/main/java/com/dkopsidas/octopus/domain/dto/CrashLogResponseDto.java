package com.dkopsidas.octopus.domain.dto;

import java.time.Instant;
import java.util.UUID;

public record CrashLogResponseDto(
        UUID id,
        Instant timestamp,
        String exceptionClass,
        String message,
        String stackTrace,
        String requestUri,
        String httpMethod,
        UUID actorId,
        String actorUsername,
        String ipAddress,
        String userAgent,
        Integer statusCode,
        boolean resolved
) {}
