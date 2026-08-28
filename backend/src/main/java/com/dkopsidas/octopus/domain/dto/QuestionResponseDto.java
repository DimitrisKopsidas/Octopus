package com.dkopsidas.octopus.domain.dto;

import com.dkopsidas.octopus.domain.entity.Answer;

import java.util.List;
import java.util.UUID;

public record QuestionResponseDto(
        Long id,
        String title,
        String imageUrl,
        boolean isActive,
        List<AnswerResponseDto> answers,
        Long courseId,
        UUID createdById,        // add this
        String createdByName
) {
}
