package com.dkopsidas.octopus.domain.dto.v2;

import java.util.List;

/** A question of a quiz on the admin edit screen. Includes correct answers, so never send it to students. */
public record QuizQuestionDto(
        Long id,
        String title,
        String imageUrl,
        List<QuizAnswerDto> answers
) {
}
