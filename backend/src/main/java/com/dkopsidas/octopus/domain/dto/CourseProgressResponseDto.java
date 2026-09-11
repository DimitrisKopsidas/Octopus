package com.dkopsidas.octopus.domain.dto;

import java.util.UUID;

public record CourseProgressResponseDto(
        Long id,
        UUID userId,
        Long courseId,
        boolean isFavorite,
        boolean isPassed
) {
}
