package com.dkopsidas.octopus.domain.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserRequestDto(
        @NotBlank(message = ERROR_MESSAGE_USERNAME_REQUIRED)
        @Size(max = 50, message = ERROR_MESSAGE_USERNAME_SIZE)
        String username,

        @NotBlank(message = ERROR_MESSAGE_DISPLAY_NAME_REQUIRED)
        @Size(max = 100, message = ERROR_MESSAGE_DISPLAY_NAME_SIZE)
        String displayName,

        @NotBlank(message = ERROR_MESSAGE_PASSWORD_REQUIRED)
        @Size(max = 100, message = ERROR_MESSAGE_PASSWORD_SIZE)
        String password,

        @Min(value = 2000, message = ERROR_MESSAGE_YEAR_MIN)
        @Max(value = 2030, message = ERROR_MESSAGE_YEAR_MAX)
        Integer year,

        @Size(max = 50, message = ERROR_MESSAGE_USER_CODE_SIZE)
        String userCode,

        @Size(max = 255, message = ERROR_MESSAGE_DISCORD_NAME_LIMIT)
        String discordName
) {
    private static final String ERROR_MESSAGE_USERNAME_REQUIRED = "Username is required";
    private static final String ERROR_MESSAGE_USERNAME_SIZE = "Username must be 50 characters or less";
    private static final String ERROR_MESSAGE_DISPLAY_NAME_REQUIRED = "Display name is required";
    private static final String ERROR_MESSAGE_DISPLAY_NAME_SIZE = "Display name must be 100 characters or less";
    private static final String ERROR_MESSAGE_PASSWORD_REQUIRED = "Password is required";
    private static final String ERROR_MESSAGE_PASSWORD_SIZE = "Password must be 100 characters or less";
    private static final String ERROR_MESSAGE_USER_CODE_SIZE = "User code must be 50 characters or less";
    private static final String ERROR_MESSAGE_YEAR_REQUIRED = "User year is required";
    private static final String ERROR_MESSAGE_DISCORD_NAME_LIMIT = "Discord name must be less than 255 characters";
    private static final String ERROR_MESSAGE_YEAR_MIN = "User year must be at least 2000";
    private static final String ERROR_MESSAGE_YEAR_MAX = "User year must be less than 2030";
}
