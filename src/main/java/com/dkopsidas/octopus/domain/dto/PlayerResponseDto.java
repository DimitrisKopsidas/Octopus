package com.dkopsidas.octopus.domain.dto;

import com.dkopsidas.octopus.domain.entity.PlayerType;

import java.util.UUID;

//response dto
public record PlayerResponseDto(
        UUID id,
        String name,
        String password,
        int year,
        PlayerType type
) {
}
