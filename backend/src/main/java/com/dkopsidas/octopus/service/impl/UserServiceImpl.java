package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.CreateUserRequestDto;
import com.dkopsidas.octopus.domain.dto.UserResponseDto;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.domain.entity.UserRole;
import com.dkopsidas.octopus.exception.InvalidHelperCodeException;
import com.dkopsidas.octopus.exception.UserAlreadyExistsException;
import com.dkopsidas.octopus.exception.UserNotFoundException;
import com.dkopsidas.octopus.mapper.UserMapper;
import com.dkopsidas.octopus.repository.UserRepository;
import com.dkopsidas.octopus.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final HelperCodeService helperCodeService;

    @Override
    public UserResponseDto getUser(UUID userId) {
        User user = userRepository.findById(userId).filter(User::isActive)
                .orElseThrow(() -> new UserNotFoundException(userId));

        return userMapper.toDto(user);
    }

    /**
     * Registration can only ever produce STUDENT or HELPER. ADMIN is granted out
     * of band (seed data, or a promotion endpoint restricted to admins), so no
     * request body can reach it.
     * Transactional because claiming a helper code and creating the user have to
     * succeed or fail together. Without it, a failure after the claim would spend
     * an invite on an account that was never created.
     */
    @Override
    @Transactional
    public UserResponseDto createUser(CreateUserRequestDto createRequest) {
        String username = createRequest.username().trim();

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new UserAlreadyExistsException(username);
        }

        String helperCode = createRequest.helperCode();
        boolean wantsHelper = helperCodeService.isPresent(helperCode);

        // Claim before writing the user: the claim is the race-safe gate, and
        // losing it must stop the registration from becoming a HELPER.
        if (wantsHelper && !helperCodeService.claim(helperCode)) {
            // A bad code is a visible error rather than a silent downgrade: the
            // user picked "Helper" in the UI and expects that to happen.
            throw new InvalidHelperCodeException();
        }

        UserRole role = wantsHelper ? UserRole.HELPER : UserRole.STUDENT;

        String passwordHash = passwordEncoder.encode(createRequest.password());

        User user = userMapper.toEntity(createRequest, passwordHash, role);
        User savedUser = userRepository.save(user);

        // Only now does the user id exist, so the audit trail is filled in last.
        if (wantsHelper) {
            helperCodeService.assignTo(helperCode, savedUser.getId());
        }

        return userMapper.toDto(savedUser);
    }

    @Override
    public UserResponseDto deactivateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.setActive(false);

        return userMapper.toDto(userRepository.save(user));
    }
}
