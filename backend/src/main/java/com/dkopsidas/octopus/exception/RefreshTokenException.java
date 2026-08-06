package com.dkopsidas.octopus.exception;

public abstract class RefreshTokenException extends RuntimeException {

    protected RefreshTokenException(String message) {
        super(message);
    }
}
