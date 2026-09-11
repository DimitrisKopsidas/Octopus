package com.dkopsidas.octopus.domain.dto;

public record UpdateCourseProgressRequestDto(
        Boolean isFavorite,
        Boolean isPassed
) {
}
