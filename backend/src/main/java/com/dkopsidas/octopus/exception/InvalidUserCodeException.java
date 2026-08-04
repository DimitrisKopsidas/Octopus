package com.dkopsidas.octopus.exception;

public class InvalidUserCodeException extends SimpleException {

    public InvalidUserCodeException() {
        super("ERROR: Invalid or already used user code.");
    }
}
