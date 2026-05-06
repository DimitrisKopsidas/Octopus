package com.dkopsidas.octopus.domain;

import com.dkopsidas.octopus.domain.entity.PlayerType;

public record CreatePlayerRequest(
        String name,
        String password,
        int year
) {

}
