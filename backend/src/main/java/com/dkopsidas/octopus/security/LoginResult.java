package com.dkopsidas.octopus.security;

import com.dkopsidas.octopus.domain.dto.AuthResponseDto;

public final class LoginResult {

    private final AuthResponseDto response;
    private final IssuedRefreshToken refreshToken;

    public LoginResult(AuthResponseDto response, IssuedRefreshToken refreshToken) {
        this.response = response;
        this.refreshToken = refreshToken;
    }

    public AuthResponseDto response() {
        return response;
    }

    public IssuedRefreshToken refreshToken() {
        return refreshToken;
    }

    @Override
    public String toString() {
        return "LoginResult[response=" + response + ", refreshToken=<redacted>]";
    }
}
