package com.dkopsidas.octopus.domain.dto;

import com.dkopsidas.octopus.domain.entity.PlayerType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record UpdatePlayerRequestDto(
        @NotBlank(message = ERROR_MESSAGE_NAME_LENGTH)
        @Length(max = 255, message = ERROR_MESSAGE_NAME_LENGTH)
        String name,
        @NotBlank
        @Length(max = 50, message = ERROR_MESSAGE_PASSWORD_LENGTH)
        String password,
        @Min(value = 1987, message = ERROR_MESSAGE_YEAR_LIMIT)
        int year,
        @NotNull(message = ERROR_MESSAGE_TYPE_MISSING)
        PlayerType type
) {
    private static final String ERROR_MESSAGE_NAME_LENGTH = "Name must be between 1 and 255 characters";
    private static final String ERROR_MESSAGE_PASSWORD_LENGTH = "Password must be between 1 and 50 characters";
    private static final String ERROR_MESSAGE_YEAR_LIMIT = "Year cannot be before be before 1987";
    private static final String ERROR_MESSAGE_TYPE_MISSING = "A player cannot be without a type";
}
