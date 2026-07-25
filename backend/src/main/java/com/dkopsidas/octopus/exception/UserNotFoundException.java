package com.dkopsidas.octopus.exception;

import lombok.Getter;

import java.util.UUID;

@Getter
public class UserNotFoundException extends SimpleException {

    private final UUID id;

    public UserNotFoundException(UUID id) {
        super(String.format("ERROR: User with ID '%s' does not exist.", id));
        this.id = id;
    }
}
