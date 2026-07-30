package com.dkopsidas.octopus.security;

import java.time.Instant;

public final class IssuedRefreshToken {

    private final String value;
    private final Instant expiresAt;

    public IssuedRefreshToken(String value, Instant expiresAt) {
        this.value = value;
        this.expiresAt = expiresAt;
    }

    public String value() {
        return value;
    }

    public Instant expiresAt() {
        return expiresAt;
    }

    @Override
    public String toString() {
        return "IssuedRefreshToken[expiresAt=" + expiresAt + "]";
    }
}
