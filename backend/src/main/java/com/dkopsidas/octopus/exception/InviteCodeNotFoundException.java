package com.dkopsidas.octopus.exception;

import lombok.Getter;

@Getter
public class InviteCodeNotFoundException extends SimpleException {

    private final Long id;

    public InviteCodeNotFoundException(Long id) {
        super(String.format("ERROR: Invite code with ID '%s' does not exist.", id));
        this.id = id;
    }
}
