package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.AuditLogResponseDto;
import com.dkopsidas.octopus.domain.dto.CreateAuditLogRequestDto;
import com.dkopsidas.octopus.domain.entity.AuditAction;
import com.dkopsidas.octopus.domain.entity.AuditLog;
import com.dkopsidas.octopus.mapper.AuditLogMapper;
import com.dkopsidas.octopus.repository.AuditLogRepository;
import com.dkopsidas.octopus.security.audit.AuditEvent;
import com.dkopsidas.octopus.service.impl.AuditLogServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditLogServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private AuditLogMapper auditLogMapper;

    private AuditLogServiceImpl auditLogService;

    @BeforeEach
    void setUp() {
        auditLogService = new AuditLogServiceImpl(auditLogRepository, auditLogMapper);
    }

    @Test
    void logEvent_SavesAndReturnsMappedDto() {
        UUID actorId = UUID.randomUUID();
        AuditEvent event = AuditEvent.success(
                actorId,
                "testuser",
                AuditAction.USER_LOGIN_SUCCESS,
                "USER",
                actorId.toString(),
                "Login success"
        );

        AuditLog savedEntity = new AuditLog();
        savedEntity.setId(UUID.randomUUID());
        savedEntity.setActorId(actorId);
        savedEntity.setActorUsername("testuser");
        savedEntity.setAction(AuditAction.USER_LOGIN_SUCCESS);
        savedEntity.setResourceType("USER");
        savedEntity.setResourceId(actorId.toString());
        savedEntity.setStatus("SUCCESS");
        savedEntity.setDetails("Login success");

        AuditLogResponseDto expectedDto = new AuditLogResponseDto(
                savedEntity.getId(),
                Instant.now(),
                actorId,
                "testuser",
                AuditAction.USER_LOGIN_SUCCESS,
                "USER",
                actorId.toString(),
                "SUCCESS",
                null,
                null,
                "Login success"
        );

        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(savedEntity);
        when(auditLogMapper.toDto(savedEntity)).thenReturn(expectedDto);

        AuditLogResponseDto result = auditLogService.logEvent(event);

        assertNotNull(result);
        assertEquals(expectedDto.id(), result.id());
        assertEquals(expectedDto.actorUsername(), result.actorUsername());

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(captor.capture());
        AuditLog captured = captor.getValue();
        assertEquals(AuditAction.USER_LOGIN_SUCCESS, captured.getAction());
        assertEquals("testuser", captured.getActorUsername());
    }

    @Test
    void getAuditLogs_DelegatesToRepository() {
        UUID actorId = UUID.randomUUID();
        Pageable pageable = PageRequest.of(0, 10);
        AuditLog auditLog = new AuditLog();
        auditLog.setId(UUID.randomUUID());

        Page<AuditLog> page = new PageImpl<>(List.of(auditLog));
        when(auditLogRepository.searchLogs(eq(actorId), eq(AuditAction.USER_LOGIN_SUCCESS), eq("SUCCESS"), any(), any(), eq(pageable)))
                .thenReturn(page);

        Page<AuditLogResponseDto> result = auditLogService.getAuditLogs(
                actorId,
                AuditAction.USER_LOGIN_SUCCESS,
                "SUCCESS",
                "TODAY",
                null,
                null,
                pageable
        );

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }
}
