package com.dkopsidas.octopus.exception;

import lombok.Getter;

@Getter
public class UserAlreadyExistsException extends SimpleException {

    private final String username;

    public UserAlreadyExistsException(String username) {
        super(String.format("ERROR: User with username '%s' already exists.", username));
        this.username = username;
    }
}
