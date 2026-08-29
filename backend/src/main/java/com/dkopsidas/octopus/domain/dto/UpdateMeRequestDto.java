package com.dkopsidas.octopus.domain.dto;

import com.dkopsidas.octopus.domain.entity.DisplayPreference;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

/**
 * Partial update of the signed-in user's own profile. A null field means "leave
 * as is"; send an empty string to clear the Discord name. Min/Max stay quiet on
 * null, so an untouched year is never rejected.
 */
public record UpdateMeRequestDto(
        @Min(value = 2000, message = ERROR_MESSAGE_YEAR_MIN)
        @Max(value = 2030, message = ERROR_MESSAGE_YEAR_MAX)
        Integer year,

        @Size(max = 255, message = ERROR_MESSAGE_DISCORD_NAME_LIMIT)
        String discordName,

        DisplayPreference displayPreference
) {
    private static final String ERROR_MESSAGE_YEAR_MIN = "User year must be at least 2000";
    private static final String ERROR_MESSAGE_YEAR_MAX = "User year must be less than 2030";
    private static final String ERROR_MESSAGE_DISCORD_NAME_LIMIT = "Discord name must be less than 255 characters";
}
