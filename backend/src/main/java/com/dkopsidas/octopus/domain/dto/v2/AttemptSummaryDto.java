package com.dkopsidas.octopus.domain.dto.v2;

import com.dkopsidas.octopus.domain.entity.ExamType;

import java.time.Instant;
import java.util.UUID;

public record AttemptSummaryDto(
        UUID attemptId,
        Long courseId,
        String courseName,
        // null = custom quiz, or the set was edited/deleted since
        UUID quizId,
        ExamType examType,
        // null = custom quiz
        Integer setNum,
        int correctCount,
        int questionCount,
        Instant startedAt,
        Instant finishedAt,
        // null = no timer
        Instant expiresAt,
        // submitted after expiresAt
        boolean late
) {
}
