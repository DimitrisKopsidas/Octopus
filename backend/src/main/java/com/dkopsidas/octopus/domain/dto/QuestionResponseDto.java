package com.dkopsidas.octopus.domain.dto;


import java.util.List;
import java.util.UUID;

public record QuestionResponseDto(
        Long id,
        String title,
        String imageUrl,
        boolean isActive,
        List<AnswerResponseDto> answers,
        Long courseId,
        UUID createdById,
        String createdByName,
        // Links the attribution to /profile/:username; null when the author is unknown or inactive.
        String createdByUsername
) {
}
