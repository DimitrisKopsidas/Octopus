package com.dkopsidas.octopus.domain.dto.v2;

public record QuizAnswerDto(
        Long id,
        String title,
        boolean isCorrect
) {
}
