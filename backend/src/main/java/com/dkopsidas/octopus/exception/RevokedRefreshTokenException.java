package com.dkopsidas.octopus.exception;

public class RevokedRefreshTokenException extends RefreshTokenException {

    public RevokedRefreshTokenException() {
        super("Refresh token has been revoked");
    }
}
