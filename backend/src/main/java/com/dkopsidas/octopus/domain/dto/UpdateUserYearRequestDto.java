package com.dkopsidas.octopus.domain.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateUserYearRequestDto(
        @NotNull(message = "Year is required")
        @Min(value = 2000, message = "Year must be at least 2000")
        @Max(value = 2030, message = "Year cannot exceed 2030")
        Integer year
) {}
