package com.dkopsidas.octopus.domain.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Length;

import java.util.List;

/**
 * Bulk question import for one course. The course comes from the path, so the
 * per-question shape is the authored JSON and nothing more -- no repeated
 * courseId in every entry.
 */
public record ImportQuestionsRequestDto(
        @NotEmpty(message = ERROR_MESSAGE_EMPTY)
        @Valid
        List<ImportedQuestion> questions
) {
    private static final String ERROR_MESSAGE_EMPTY = "The file contains no questions";

    public record ImportedQuestion(
            @NotNull(message = ERROR_MESSAGE_TITLE_LENGTH)
            @Length(min = 1, max = 510, message = ERROR_MESSAGE_TITLE_LENGTH)
            String title,

            String imageUrl,

            @NotNull(message = ERROR_MESSAGE_ANSWER_COUNT)
            @Size(min = 2, max = 10, message = ERROR_MESSAGE_ANSWER_COUNT)
            @Valid
            List<AnswerRequestDto> answers
    ) {
        private static final String ERROR_MESSAGE_TITLE_LENGTH = "Title must be between 1 and 510 characters";
        private static final String ERROR_MESSAGE_ANSWER_COUNT = "Answer count cannot be less than 2 and more than 10";
    }
}
