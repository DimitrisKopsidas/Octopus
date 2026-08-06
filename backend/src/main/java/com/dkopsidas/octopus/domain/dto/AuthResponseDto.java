package com.dkopsidas.octopus.domain.dto;

public record AuthResponseDto(
        String accessToken,
        String tokenType,
        long expiresIn,
        UserResponseDto user
) {
    @Override
    public String toString() {
        return "AuthResponseDto[tokenType=" + tokenType
                + ", expiresIn=" + expiresIn
                + ", user=" + user
                + "]";
    }
}
