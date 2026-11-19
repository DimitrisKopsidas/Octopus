package com.dkopsidas.octopus.domain.dto.v2;

import java.util.List;

public record QuestionResultDto(
        Long questionId,
        boolean correct,
        List<Long> selectedAnswerIds,
        List<Long> correctAnswerIds
) {
}
