package com.dkopsidas.octopus.domain.dto.v2;

import com.dkopsidas.octopus.domain.entity.ExamType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/** Create a quiz set, or replace one, questionIds are in quiz order. */
public record QuizRequestDto(
        @NotNull
        Long courseId,
        @NotNull
        ExamType examType,
        @NotNull @Min(1)
        Integer setNum,
        // fixed max, same bound as custom quizzes
        @NotEmpty @Size(max = 200)
        List<@NotNull Long> questionIds
) {
}
