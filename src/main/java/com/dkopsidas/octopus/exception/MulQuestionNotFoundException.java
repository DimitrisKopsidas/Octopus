package com.dkopsidas.octopus.exception;

import lombok.Getter;

@Getter
public class MulQuestionNotFoundException extends RuntimeException {

    private final Long id;

    public MulQuestionNotFoundException(Long id) {
        super(String.format("MulQuestion with ID '%s' does not exist.", id));
        this.id = id;
    }

}
