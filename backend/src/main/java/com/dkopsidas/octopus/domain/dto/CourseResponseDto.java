package com.dkopsidas.octopus.domain.dto;

public record CourseResponseDto(
        Long id,
        String name,
        int semester,
        int questionSetSize,
        int defaultTimerMinutes
) {
}
