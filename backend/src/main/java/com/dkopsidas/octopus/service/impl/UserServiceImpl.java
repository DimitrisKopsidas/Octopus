package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.CreateUserRequestDto;
import com.dkopsidas.octopus.domain.dto.UserResponseDto;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.exception.UserAlreadyExistsException;
import com.dkopsidas.octopus.exception.UserNotFoundException;
import com.dkopsidas.octopus.mapper.UserMapper;
import com.dkopsidas.octopus.repository.UserRepository;
import com.dkopsidas.octopus.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDto getUser(UUID userId) {
        User user = userRepository.findById(userId).filter(User::isActive)
                .orElseThrow(() -> new UserNotFoundException(userId));

        return userMapper.toDto(user);
    }

    @Override
    public UserResponseDto createUser(CreateUserRequestDto createRequest) {
        String username = createRequest.username().trim();

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new UserAlreadyExistsException(username);
        }

        String passwordHash = passwordEncoder.encode(createRequest.password());

        User user = userMapper.toEntity(createRequest, passwordHash);
        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    public UserResponseDto deactivateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.setActive(false);

        return userMapper.toDto(userRepository.save(user));
    }
}
