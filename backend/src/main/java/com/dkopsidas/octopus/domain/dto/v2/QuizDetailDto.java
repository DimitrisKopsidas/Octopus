package com.dkopsidas.octopus.domain.dto.v2;

import com.dkopsidas.octopus.domain.entity.ExamType;

import java.util.List;
import java.util.UUID;

/** A quiz with its questions in order, for the admin edit screen. */
public record QuizDetailDto(
        UUID id,
        Long courseId,
        ExamType examType,
        int setNum,
        List<QuizQuestionDto> questions
) {
}
