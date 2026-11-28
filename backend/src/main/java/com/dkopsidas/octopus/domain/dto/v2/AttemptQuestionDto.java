package com.dkopsidas.octopus.domain.dto.v2;

import java.util.List;

public record AttemptQuestionDto(
        Long id,
        String title,
        String imageUrl,
        boolean multiSelect,
        List<AttemptAnswerDto> answers
) {
}
