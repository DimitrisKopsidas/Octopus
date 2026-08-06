package com.dkopsidas.octopus.exception;

public class InvalidRefreshTokenException extends RefreshTokenException {

    public InvalidRefreshTokenException() {
        super("Invalid refresh token");
    }
}
