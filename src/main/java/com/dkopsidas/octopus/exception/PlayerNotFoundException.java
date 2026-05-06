package com.dkopsidas.octopus.exception;

import java.util.UUID;

public class PlayerNotFoundException extends RuntimeException {

    private final UUID id;

    public PlayerNotFoundException(UUID id) {
        super(String.format("Player with ID '%s' does not exist.", id));
        this.id = id;
    }

    public UUID getId() {
        return id;
    }
}
