package com.dkopsidas.octopus.domain.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

/**
 * Which name a user wants shown publicly - on question attribution today, on the
 * leaderboard later. Stored as text, so adding a third option later is a new
 * constant rather than a migration.
 */
public enum DisplayPreference {
    DISPLAY_NAME,
    DISCORD_NAME;

    /** Rows written before this column existed read as null; treat those as the default. */
    public static DisplayPreference orDefault(DisplayPreference preference) {
        return preference != null ? preference : DISPLAY_NAME;
    }

    @JsonCreator
    public static DisplayPreference fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return Arrays.stream(values())
                .filter(preference -> preference.name().equalsIgnoreCase(value.trim()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown display preference: " + value));
    }

    @JsonValue
    public String toValue() {
        return name();
    }
}
