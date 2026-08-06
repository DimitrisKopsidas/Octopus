package com.dkopsidas.octopus.exception;

public class MissingRefreshTokenException extends RuntimeException {

    public MissingRefreshTokenException() {
        super("Refresh-token cookie is required");
    }
}
