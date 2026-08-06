package com.dkopsidas.octopus.mapper.impl;

import com.dkopsidas.octopus.domain.dto.AuditLogResponseDto;
import com.dkopsidas.octopus.domain.entity.AuditLog;
import com.dkopsidas.octopus.mapper.AuditLogMapper;
import org.springframework.stereotype.Component;

@Component
public class AuditLogMapperImpl implements AuditLogMapper {

    @Override
    public AuditLogResponseDto toDto(AuditLog auditLog) {
        if (auditLog == null) return null;
        return new AuditLogResponseDto(
                auditLog.getId(),
                auditLog.getTimestamp(),
                auditLog.getActorId(),
                auditLog.getActorUsername(),
                auditLog.getAction(),
                auditLog.getResourceType(),
                auditLog.getResourceId(),
                auditLog.getStatus(),
                auditLog.getIpAddress(),
                auditLog.getUserAgent(),
                auditLog.getDetails()
        );
    }
}
