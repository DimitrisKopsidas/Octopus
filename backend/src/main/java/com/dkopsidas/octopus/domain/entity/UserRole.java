package com.dkopsidas.octopus.domain.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum UserRole {
    STUDENT,
    HELPER,
    ADMIN;

    @JsonCreator
    public static UserRole fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return Arrays.stream(values())
                .filter(role -> role.name().equalsIgnoreCase(value.trim()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown user role: " + value));
    }

    @JsonValue
    public String toValue() {
        return name();
    }
}
