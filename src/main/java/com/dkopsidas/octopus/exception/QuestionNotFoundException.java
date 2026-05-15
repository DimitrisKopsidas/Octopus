package com.dkopsidas.octopus.exception;

import lombok.Getter;

@Getter
public class QuestionNotFoundException extends SimpleException {

    private final Long id;

    public QuestionNotFoundException(Long id) {
        super(String.format("ERROR: Question with ID '%s' does not exist.", id));
        this.id = id;
    }
}
