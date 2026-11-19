package com.dkopsidas.octopus.domain.dto.v2;

import com.dkopsidas.octopus.domain.entity.ExamType;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record AttemptStartResponseDto(
        UUID attemptId,
        Long courseId,
        ExamType examType,
        // null = custom quiz
        Integer setNum,
        // null = no timer
        Instant expiresAt,
        List<AttemptQuestionDto> questions
) {
}
