package com.dkopsidas.octopus.exception;

public class InactiveAccountException extends RuntimeException {

    public InactiveAccountException() {
        super("Account is unavailable");
    }

    public InactiveAccountException(String message) {
        super(message);
    }
}
