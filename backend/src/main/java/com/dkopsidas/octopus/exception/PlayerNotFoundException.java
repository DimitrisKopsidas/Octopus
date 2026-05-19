package com.dkopsidas.octopus.exception;

import lombok.Getter;

import java.util.UUID;

@Getter
public class PlayerNotFoundException extends RuntimeException {

    private final UUID id;

    public PlayerNotFoundException(UUID id) {
        super(String.format("ERROR: Player with ID '%s' does not exist.", id));
        this.id = id;
    }
}
