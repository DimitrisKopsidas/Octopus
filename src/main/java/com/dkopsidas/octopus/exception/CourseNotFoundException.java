package com.dkopsidas.octopus.exception;

import lombok.Getter;

@Getter
public class CourseNotFoundException extends SimpleException {

    private final Long id;

    public CourseNotFoundException(Long id) {
        super(String.format("ERROR: Course with ID '%s' does not exist.", id));
        this.id = id;
    }
}
