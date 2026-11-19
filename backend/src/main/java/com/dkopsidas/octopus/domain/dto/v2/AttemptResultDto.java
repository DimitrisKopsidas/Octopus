package com.dkopsidas.octopus.domain.dto.v2;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record AttemptResultDto(
        UUID attemptId,
        int correctCount,
        int questionCount,
        Instant finishedAt,
        List<QuestionResultDto> questions
) {
}
