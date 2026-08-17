package com.dkopsidas.octopus.domain.dto;

import java.time.Instant;

public record CourseResponseDto(
        Long id,
        String name,
        int semester,
        int questionSetSize,
        int defaultTimerMinutes,
        Instant lastUpdated,
        long questionCount
) {
}
