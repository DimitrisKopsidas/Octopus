package com.dkopsidas.octopus.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AnswerRequestDto(
        @NotBlank
        String title,
        @NotNull
        boolean isCorrect
) {
}
