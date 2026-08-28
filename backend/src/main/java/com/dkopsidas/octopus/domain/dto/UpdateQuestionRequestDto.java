package com.dkopsidas.octopus.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Length;

import java.util.List;

public record UpdateQuestionRequestDto(
        @NotBlank(message = ERROR_MESSAGE_TITLE_LENGTH)
        @Length(max = 510, message = ERROR_MESSAGE_TITLE_LENGTH)
        String title,
        String imageUrl,
        boolean isActive,
        @Size(min = 2, max = 10, message = ERROR_MESSAGE_ANSWER_COUNT)
        List<AnswerRequestDto> answers
) {
    private static final String ERROR_MESSAGE_TITLE_LENGTH = "Title must be between 1 and 510 characters";
    private static final String ERROR_MESSAGE_ANSWER_COUNT = "Answer count cannot be less than 2 and more than 10";
}
