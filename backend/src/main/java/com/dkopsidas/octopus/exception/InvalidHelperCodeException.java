package com.dkopsidas.octopus.exception;

public class InvalidHelperCodeException extends SimpleException {

    public InvalidHelperCodeException() {
        super("ERROR: Invalid or already used helper code.");
    }
}
