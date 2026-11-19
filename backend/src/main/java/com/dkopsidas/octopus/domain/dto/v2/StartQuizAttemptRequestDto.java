package com.dkopsidas.octopus.domain.dto.v2;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record StartQuizAttemptRequestDto(
        // null = no timer
        @Min(1) @Max(600)
        Integer timerMinutes
) {
}
