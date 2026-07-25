package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.CreateUserRequestDto;
import com.dkopsidas.octopus.domain.dto.UserResponseDto;

import java.util.UUID;

public interface UserService {

    UserResponseDto getUser(UUID userId);

    UserResponseDto createUser(CreateUserRequestDto dto);

    UserResponseDto deactivateUser(UUID userId);
}
