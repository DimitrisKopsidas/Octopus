package com.dkopsidas.octopus.mapper;

import com.dkopsidas.octopus.domain.dto.CrashLogResponseDto;
import com.dkopsidas.octopus.domain.entity.CrashLog;

public interface CrashLogMapper {
    CrashLogResponseDto toDto(CrashLog crashLog);
}
