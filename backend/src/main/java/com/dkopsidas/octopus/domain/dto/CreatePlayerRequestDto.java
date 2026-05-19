package com.dkopsidas.octopus.domain.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.Length;

public record CreatePlayerRequestDto(
        @NotBlank(message = ERROR_MESSAGE_NAME_LENGTH)
        @Length(max = 255, message = ERROR_MESSAGE_NAME_LENGTH)
        String name,
        @NotBlank
        @Length(max = 50, message = ERROR_MESSAGE_PASSWORD_LENGTH)
        String password,
        @Min(value = 1987, message = ERROR_MESSAGE_YEAR_LIMIT)
        int year
) {
    private static final String ERROR_MESSAGE_NAME_LENGTH = "Name must be between 1 and 255 characters";
    private static final String ERROR_MESSAGE_PASSWORD_LENGTH = "Password must be between 1 and 50 characters";
    private static final String ERROR_MESSAGE_YEAR_LIMIT = "Year cannot be before be before 1987";
}
