package com.dkopsidas.octopus.exception;

import lombok.Getter;

@Getter
public class IsReadOnlyException extends SimpleException {

    public IsReadOnlyException() {
        super(String.format("ERROR: App is in read only mode."));
    }
}
