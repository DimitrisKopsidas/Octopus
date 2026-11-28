package com.dkopsidas.octopus.domain.dto.v2;

import java.util.List;

public record AttemptReviewQuestionDto(
        Long id,
        String title,
        String imageUrl,
        boolean correct,
        List<AttemptReviewAnswerDto> answers
) {
}
