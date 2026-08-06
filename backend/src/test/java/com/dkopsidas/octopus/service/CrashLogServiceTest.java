package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.CrashLogResponseDto;
import com.dkopsidas.octopus.domain.dto.CreateCrashLogRequestDto;
import com.dkopsidas.octopus.domain.entity.CrashLog;
import com.dkopsidas.octopus.mapper.CrashLogMapper;
import com.dkopsidas.octopus.repository.CrashLogRepository;
import com.dkopsidas.octopus.service.impl.CrashLogServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CrashLogServiceTest {

    @Mock
    private CrashLogRepository crashLogRepository;

    @Mock
    private CrashLogMapper crashLogMapper;

    private CrashLogServiceImpl crashLogService;

    @BeforeEach
    void setUp() {
        crashLogService = new CrashLogServiceImpl(crashLogRepository, crashLogMapper);
    }

    @Test
    void logCrash_SavesEntityAndReturnsDto() {
        NullPointerException npe = new NullPointerException("Test null pointer");
        UUID actorId = UUID.randomUUID();

        CrashLog savedLog = new CrashLog();
        savedLog.setId(UUID.randomUUID());
        savedLog.setExceptionClass(NullPointerException.class.getName());
        savedLog.setMessage("Test null pointer");
        savedLog.setStatusCode(500);

        CrashLogResponseDto expectedDto = new CrashLogResponseDto(
                savedLog.getId(),
                Instant.now(),
                NullPointerException.class.getName(),
                "Test null pointer",
                "stacktrace...",
                "/api/test",
                "GET",
                actorId,
                "testuser",
                "127.0.0.1",
                "JUnit",
                500,
                false
        );

        when(crashLogRepository.save(any(CrashLog.class))).thenReturn(savedLog);
        when(crashLogMapper.toDto(savedLog)).thenReturn(expectedDto);

        CrashLogResponseDto result = crashLogService.logCrash(
                npe,
                "/api/test",
                "GET",
                500,
                actorId,
                "testuser",
                "127.0.0.1",
                "JUnit"
        );

        assertNotNull(result);
        assertEquals(expectedDto.id(), result.id());
        assertEquals(NullPointerException.class.getName(), result.exceptionClass());
        verify(crashLogRepository).save(any(CrashLog.class));
    }

    @Test
    void markAsResolved_UpdatesAndReturnsDto() {
        UUID id = UUID.randomUUID();
        CrashLog logEntity = new CrashLog();
        logEntity.setId(id);
        logEntity.setResolved(false);

        CrashLogResponseDto expectedDto = new CrashLogResponseDto(
                id, Instant.now(), "Exception", "Msg", "Trace", "/api", "GET", null, null, "127.0.0.1", "Agent", 500, true
        );

        when(crashLogRepository.findById(id)).thenReturn(Optional.of(logEntity));
        when(crashLogRepository.save(logEntity)).thenReturn(logEntity);
        when(crashLogMapper.toDto(logEntity)).thenReturn(expectedDto);

        CrashLogResponseDto result = crashLogService.markAsResolved(id, true);

        assertNotNull(result);
        assertTrue(result.resolved());
        assertTrue(logEntity.isResolved());
    }
}
