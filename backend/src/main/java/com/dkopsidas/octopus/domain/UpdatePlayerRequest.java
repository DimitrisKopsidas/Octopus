package com.dkopsidas.octopus.domain;//TODO REMOVE

import com.dkopsidas.octopus.domain.entity.PlayerType;

public record UpdatePlayerRequest(
        String name,
        String password,
        int year,
        PlayerType type
) {
}
