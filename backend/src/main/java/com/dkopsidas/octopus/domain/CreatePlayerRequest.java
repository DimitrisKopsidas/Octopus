package com.dkopsidas.octopus.domain;//TODO REMOVE

public record CreatePlayerRequest(
        String name,
        String password,
        int year
) {

}
