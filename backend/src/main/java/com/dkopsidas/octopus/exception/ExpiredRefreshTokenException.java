package com.dkopsidas.octopus.exception;

public class ExpiredRefreshTokenException extends RefreshTokenException {

    public ExpiredRefreshTokenException() {
        super("Refresh token has expired");
    }
}
