package com.dkopsidas.octopus.exception;

import lombok.Getter;

@Getter
public class QuestionNotFoundException extends RuntimeException {

    private final Long id;

    public QuestionNotFoundException(Long id) {
        super(String.format("Question with ID '%s' does not exist.", id));
        this.id = id;
    }

}
