package com.dkopsidas.octopus.domain.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateUserYearRequestDto(
        @NotNull(message = "Year is required")
        @Min(value = 1, message = "Year must be at least 1")
        @Max(value = 5, message = "Year cannot exceed 5")
        Integer year
) {}
