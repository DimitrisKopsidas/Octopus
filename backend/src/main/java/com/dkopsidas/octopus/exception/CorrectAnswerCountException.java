package com.dkopsidas.octopus.exception;


import lombok.Getter;

@Getter
public class CorrectAnswerCountException extends SimpleException {

    private final Long id;

    public CorrectAnswerCountException(Long id) {
        super(String.format("ERROR: Questions must have exactly one correct answer.", id));
        this.id = id;
    }
}
