package com.dkopsidas.octopus.domain.dto.v2;

public record AttemptReviewAnswerDto(
        Long id,
        String title,
        boolean isCorrect,
        // picked by the user in this attempt
        boolean selected
) {
}
