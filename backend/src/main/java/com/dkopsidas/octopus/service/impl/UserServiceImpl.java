package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.CreateUserRequestDto;
import com.dkopsidas.octopus.domain.dto.UserResponseDto;
import com.dkopsidas.octopus.domain.entity.AuditAction;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.domain.entity.UserRole;
import com.dkopsidas.octopus.exception.InvalidCredentialsException;
import com.dkopsidas.octopus.exception.InvalidUserCodeException;
import com.dkopsidas.octopus.exception.UserAlreadyExistsException;
import com.dkopsidas.octopus.exception.UserNotFoundException;
import com.dkopsidas.octopus.mapper.UserMapper;
import com.dkopsidas.octopus.repository.UserRepository;
import com.dkopsidas.octopus.security.audit.AuditEvent;
import com.dkopsidas.octopus.service.UserService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserCodeService userCodeService;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public UserResponseDto getUser(UUID userId) {
        User user = userRepository.findById(userId).filter(User::isActive)
                .orElseThrow(() -> new UserNotFoundException(userId));

        return userMapper.toDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponseDto> getUsers(UserRole role, Boolean active, String queryStr, Pageable pageable) {
        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (role != null) {
                predicates.add(cb.equal(root.get("role"), role));
            }
            if (active != null) {
                predicates.add(cb.equal(root.get("active"), active));
            }
            if (queryStr != null && !queryStr.isBlank()) {
                String q = "%" + queryStr.trim().toLowerCase() + "%";
                Predicate usernameMatch = cb.like(cb.lower(root.get("username")), q);
                Predicate displayNameMatch = cb.like(cb.lower(root.get("displayName")), q);
                predicates.add(cb.or(usernameMatch, displayNameMatch));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return userRepository.findAll(spec, pageable).map(userMapper::toDto);
    }

    @Override
    @Transactional
    public UserResponseDto createUser(CreateUserRequestDto createRequest) {
        String username = createRequest.username().trim();

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            eventPublisher.publishEvent(AuditEvent.failure(
                    null,
                    username,
                    AuditAction.USER_REGISTER_FAILED,
                    "USER",
                    null,
                    "Username already exists: " + username
            ));
            throw new UserAlreadyExistsException(username);
        }

        String userCode = createRequest.userCode();
        boolean usesCode = userCodeService.isPresent(userCode);

        // The code row carries the role it grants, so HELPER and ADMIN
        // registrations follow the exact same path from here on.
        UserRole role = UserRole.STUDENT;
        if (usesCode) {
            role = userCodeService.claim(userCode).orElseGet(() -> {
                eventPublisher.publishEvent(AuditEvent.failure(
                        null,
                        username,
                        AuditAction.USER_REGISTER_FAILED,
                        "USER",
                        null,
                        "Invalid or spent user code"
                ));
                throw new InvalidUserCodeException();
            });
        }

        String passwordHash = passwordEncoder.encode(createRequest.password());

        User user = userMapper.toEntity(createRequest, passwordHash, role);
        User savedUser = userRepository.save(user);

        if (usesCode) {
            userCodeService.assignTo(userCode, savedUser.getId());
        }

        eventPublisher.publishEvent(AuditEvent.success(
                savedUser.getId(),
                savedUser.getUsername(),
                AuditAction.USER_REGISTERED,
                "USER",
                savedUser.getId().toString(),
                "User created with role: " + savedUser.getRole()
        ));

        return userMapper.toDto(savedUser);
    }

    @Override
    @Transactional
    public UserResponseDto deactivateUser(UUID userId) {
        return toggleUserStatus(userId, false, null, null);
    }

    @Override
    @Transactional
    public UserResponseDto updateUserYear(UUID userId, Integer year) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.setYear(year);
        User saved = userRepository.save(user);

        eventPublisher.publishEvent(AuditEvent.success(
                user.getId(),
                user.getUsername(),
                AuditAction.USER_UPDATED,
                "USER",
                user.getId().toString(),
                "Updated study year to: " + year
        ));

        return userMapper.toDto(saved);
    }

    @Override
    @Transactional
    public void updatePassword(UUID userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new InvalidCredentialsException("Old password does not match");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        eventPublisher.publishEvent(AuditEvent.success(
                user.getId(),
                user.getUsername(),
                AuditAction.USER_UPDATED,
                "USER",
                user.getId().toString(),
                "Password updated"
        ));
    }

    @Override
    @Transactional
    public UserResponseDto updateUserRole(UUID userId, UserRole role, UUID actorId, String actorUsername) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        UserRole oldRole = user.getRole();
        user.setRole(role);
        User saved = userRepository.save(user);

        eventPublisher.publishEvent(AuditEvent.success(
                actorId != null ? actorId : user.getId(),
                actorUsername != null ? actorUsername : user.getUsername(),
                AuditAction.USER_ROLE_CHANGED,
                "USER",
                user.getId().toString(),
                "Changed role for @" + user.getUsername() + " from " + oldRole + " to " + role
        ));

        return userMapper.toDto(saved);
    }

    @Override
    @Transactional
    public UserResponseDto toggleUserStatus(UUID userId, Boolean active, UUID actorId, String actorUsername) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.setActive(active);
        User saved = userRepository.save(user);

        eventPublisher.publishEvent(AuditEvent.success(
                actorId != null ? actorId : user.getId(),
                actorUsername != null ? actorUsername : user.getUsername(),
                active ? AuditAction.USER_UPDATED : AuditAction.USER_DEACTIVATED,
                "USER",
                user.getId().toString(),
                active ? "Reactivated user account @" + user.getUsername() : "Deactivated user account @" + user.getUsername()
        ));

        return userMapper.toDto(saved);
    }

    public Long countActiveUsers(){
        return userRepository.countByActiveTrue();
    }
}
