package com.dkopsidas.octopus.domain.dto;

public record AnswerResponseDto(
        Long id,
        String title,
        boolean isCorrect
) {
}
