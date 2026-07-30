package com.dkopsidas.octopus.security;

import java.time.Instant;

public final class IssuedAccessToken {

    private final String value;
    private final Instant expiresAt;
    private final long expiresIn;

    public IssuedAccessToken(String value, Instant expiresAt, long expiresIn) {
        this.value = value;
        this.expiresAt = expiresAt;
        this.expiresIn = expiresIn;
    }

    public String value() {
        return value;
    }

    public Instant expiresAt() {
        return expiresAt;
    }

    public long expiresIn() {
        return expiresIn;
    }

    @Override
    public String toString() {
        return "IssuedAccessToken[expiresAt=" + expiresAt
                + ", expiresIn=" + expiresIn
                + "]";
    }
}
