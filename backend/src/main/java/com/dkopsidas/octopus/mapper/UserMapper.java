package com.dkopsidas.octopus.mapper;

import com.dkopsidas.octopus.domain.dto.CreateUserRequestDto;
import com.dkopsidas.octopus.domain.dto.UserResponseDto;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.domain.entity.UserRole;

public interface UserMapper {

    User toEntity(CreateUserRequestDto dto, String passwordHash, UserRole role);

    UserResponseDto toDto(User user);
}
