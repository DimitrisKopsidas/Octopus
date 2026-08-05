package com.dkopsidas.octopus.domain.dto;

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

        Integer year,

        @Size(max = 50, message = ERROR_MESSAGE_USER_CODE_SIZE)
        String userCode
) {
    private static final String ERROR_MESSAGE_USERNAME_REQUIRED = "Username is required";
    private static final String ERROR_MESSAGE_USERNAME_SIZE = "Username must be 50 characters or less";
    private static final String ERROR_MESSAGE_DISPLAY_NAME_REQUIRED = "Display name is required";
    private static final String ERROR_MESSAGE_DISPLAY_NAME_SIZE = "Display name must be 100 characters or less";
    private static final String ERROR_MESSAGE_PASSWORD_REQUIRED = "Password is required";
    private static final String ERROR_MESSAGE_PASSWORD_SIZE = "Password must be 100 characters or less";
    private static final String ERROR_MESSAGE_USER_CODE_SIZE = "User code must be 50 characters or less";
}
