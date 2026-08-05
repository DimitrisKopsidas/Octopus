package com.dkopsidas.octopus.domain.dto;

import com.dkopsidas.octopus.domain.entity.UserRole;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateInviteCodeRequestDto(
        @NotNull(message = "Target role is required")
        UserRole targetRole,

        @Size(max = 50, message = "Custom code must be 50 characters or less")
        String customCode
) {}
