package com.dkopsidas.octopus.domain.dto;


import java.util.List;

public record QuestionResponseDto(
        Long id,
        String title,
        String imageUrl,
        boolean isActive,
        List<AnswerResponseDto> answers,
        Long courseId
) {
}
