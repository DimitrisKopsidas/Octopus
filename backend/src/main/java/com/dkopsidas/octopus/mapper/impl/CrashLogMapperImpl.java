package com.dkopsidas.octopus.mapper.impl;

import com.dkopsidas.octopus.domain.dto.CrashLogResponseDto;
import com.dkopsidas.octopus.domain.entity.CrashLog;
import com.dkopsidas.octopus.mapper.CrashLogMapper;
import org.springframework.stereotype.Component;

@Component
public class CrashLogMapperImpl implements CrashLogMapper {

    @Override
    public CrashLogResponseDto toDto(CrashLog crashLog) {
        if (crashLog == null) return null;
        return new CrashLogResponseDto(
                crashLog.getId(),
                crashLog.getTimestamp(),
                crashLog.getExceptionClass(),
                crashLog.getMessage(),
                crashLog.getStackTrace(),
                crashLog.getRequestUri(),
                crashLog.getHttpMethod(),
                crashLog.getActorId(),
                crashLog.getActorUsername(),
                crashLog.getIpAddress(),
                crashLog.getUserAgent(),
                crashLog.getStatusCode(),
                crashLog.isResolved()
        );
    }
}
