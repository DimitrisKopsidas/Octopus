package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.CreateUserRequestDto;
import com.dkopsidas.octopus.domain.dto.UserResponseDto;
import com.dkopsidas.octopus.domain.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface UserService {

    UserResponseDto getUser(UUID userId);

    Page<UserResponseDto> getUsers(UserRole role, Boolean active, String query, Pageable pageable);

    UserResponseDto createUser(CreateUserRequestDto dto);

    UserResponseDto deactivateUser(UUID userId);

    UserResponseDto updateUserYear(UUID userId, Integer year);

    void updatePassword(UUID userId, String oldPassword, String newPassword);

    UserResponseDto updateUserRole(UUID userId, UserRole role, UUID actorId, String actorUsername);

    UserResponseDto toggleUserStatus(UUID userId, Boolean active, UUID actorId, String actorUsername);

    Long countActiveUsers();
}
