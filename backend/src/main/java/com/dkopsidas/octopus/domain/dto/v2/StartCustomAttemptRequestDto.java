package com.dkopsidas.octopus.domain.dto.v2;

import com.dkopsidas.octopus.domain.entity.ExamType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/** Start a custom-size quiz of random questions from a course. */
public record StartCustomAttemptRequestDto(
        @NotNull
        ExamType examType,
        @NotNull @Min(1) @Max(200)
        Integer count,
        @Min(1) @Max(600)
        Integer timerMinutes
) {
}
