package com.dkopsidas.octopus.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;

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

        @NotNull(message = ERROR_MESSAGE_YEAR_REQUIRED)
        //Potential error
        //@Size(min = 2000, max = 2030, message = ERROR_MESSAGE_YEAR_LIMIT)
        //Potential fix
        @Min(1)
        @Max(5)
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
    private static final String ERROR_MESSAGE_YEAR_REQUIRED = "Display name is required";
    private static final String ERROR_MESSAGE_YEAR_LIMIT = "Year must be between 2000 and 2030";
    private static final String ERROR_MESSAGE_DISCORD_NAME_LIMIT = "Discord name must be less than 255 characters";
}
