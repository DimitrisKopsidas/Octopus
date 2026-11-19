package com.dkopsidas.octopus.domain.dto.v2;

import com.dkopsidas.octopus.domain.entity.ExamType;

import java.time.Instant;
import java.util.UUID;

/** One row of a course's quiz list. */
public record QuizResponseDto(
        UUID id,
        Long courseId,
        ExamType examType,
        int setNum,
        int questionCount,
        Instant updated
) {
}
