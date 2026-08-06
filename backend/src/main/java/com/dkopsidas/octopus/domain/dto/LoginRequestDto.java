package com.dkopsidas.octopus.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequestDto(
        @NotBlank(message = "Username is required")
        @Size(max = 50, message = "Username must be 50 characters or less")
        String username,

        @NotBlank(message = "Password is required")
        @Size(max = 100, message = "Password must be 100 characters or less")
        String password
) {
    @Override
    public String toString() {
        return "LoginRequestDto[username=" + username + ", password=<redacted>]";
    }
}
