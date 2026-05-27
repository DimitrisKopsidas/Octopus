package com.dkopsidas.octopus.domain.dto;

import jakarta.validation.constraints.Min;

public record UpdateCourseRequestDto(
        @Min(value = 1, message = ERROR_MESSAGE_QUESTION_SET_SIZE)
        int questionSetSize,

        @Min(value = 5, message = ERROR_MESSAGE_TIMER_LOWER_LIMIT)
        int defaultTimerMinutes
) {
    private static final String ERROR_MESSAGE_QUESTION_SET_SIZE = "Question set size must be at least 1";
    private static final String ERROR_MESSAGE_TIMER_LOWER_LIMIT = "Default timer must be at least 5 minutes";
}
