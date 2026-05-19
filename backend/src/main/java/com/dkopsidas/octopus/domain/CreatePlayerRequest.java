package com.dkopsidas.octopus.domain;

public record CreatePlayerRequest(
        String name,
        String password,
        int year
) {

}
