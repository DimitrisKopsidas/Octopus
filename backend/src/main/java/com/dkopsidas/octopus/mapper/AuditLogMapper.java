package com.dkopsidas.octopus.mapper;

import com.dkopsidas.octopus.domain.dto.AuditLogResponseDto;
import com.dkopsidas.octopus.domain.entity.AuditLog;

public interface AuditLogMapper {
    AuditLogResponseDto toDto(AuditLog auditLog);
}
