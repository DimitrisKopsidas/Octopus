package com.dkopsidas.octopus.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Length;

import java.util.List;

public record CreateQuestionRequestDto(
        @NotBlank(message = ERROR_MESSAGE_TITLE_LENGTH)
        @Length(max = 255, message = ERROR_MESSAGE_TITLE_LENGTH)
        String title,
        @Size(min = 3, max = 5, message = ERROR_MESSAGE_ANSWER_COUNT)
        List<AnswerRequestDto> answers,
        @NotNull(message = ERROR_MESSAGE_COURSE_ATTACHED)
        Long courseId
) {
    private static final String ERROR_MESSAGE_TITLE_LENGTH = "Title must be between 1 and 255 characters";
    private static final String ERROR_MESSAGE_ANSWER_COUNT = "Answer count cannot be less than 3 and more than 5";
    private static final String ERROR_MESSAGE_COURSE_ATTACHED = "A question must have a course attached";
}
