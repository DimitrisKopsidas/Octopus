package com.dkopsidas.octopus.mapper.impl;

import com.dkopsidas.octopus.domain.dto.CreateUserRequestDto;
import com.dkopsidas.octopus.domain.dto.UserResponseDto;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.domain.entity.UserRole;
import com.dkopsidas.octopus.mapper.UserMapper;
import org.springframework.stereotype.Component;

@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toEntity(CreateUserRequestDto dto, String passwordHash) {
        User user = new User();
        user.setUsername(dto.username().trim());
        user.setDisplayName(dto.displayName().trim());
        user.setPasswordHash(passwordHash);
        user.setYear(dto.year());
        user.setRole(dto.role() != null ? dto.role() : UserRole.STUDENT);
        user.setActive(true);

        return user;
    }

    @Override
    public UserResponseDto toDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getYear(),
                user.getRole(),
                user.isActive(),
                user.getCreated(),
                user.getUpdated()
        );
    }
}
