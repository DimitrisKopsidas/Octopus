package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.CreateUserRequestDto;
import com.dkopsidas.octopus.domain.dto.UpdateMeRequestDto;
import com.dkopsidas.octopus.domain.dto.UpdatePasswordRequestDto;
import com.dkopsidas.octopus.domain.dto.UserResponseDto;
import com.dkopsidas.octopus.domain.entity.UserRole;
import com.dkopsidas.octopus.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/users")
public class UserController {

    private final UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<UserResponseDto>> getUsers(
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String query,
            @PageableDefault(size = 15, sort = "username", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<UserResponseDto> users = userService.getUsers(role, active, query, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping(path = "/{userId}")
    public ResponseEntity<UserResponseDto> getUser(
            @PathVariable UUID userId
    ) {
        UserResponseDto user = userService.getUser(userId);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(
            @Valid @RequestBody CreateUserRequestDto createUserRequestDto
    ) {
        UserResponseDto createdUser = userService.createUser(createUserRequestDto);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping(path = "/me")
    public ResponseEntity<UserResponseDto> updateMe(
            @Valid @RequestBody UpdateMeRequestDto requestDto,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        UserResponseDto updatedUser = userService.updateMe(userId, requestDto);
        return ResponseEntity.ok(updatedUser);
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping(path = "/me/password")
    public ResponseEntity<Void> updateMyPassword(
            @Valid @RequestBody UpdatePasswordRequestDto requestDto,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        userService.updatePassword(userId, requestDto.oldPassword(), requestDto.newPassword());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping(path = "/{userId}/role")
    public ResponseEntity<UserResponseDto> updateUserRole(
            @PathVariable UUID userId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID actorId = jwt != null ? UUID.fromString(jwt.getSubject()) : null;
        String actorUsername = jwt != null ? jwt.getClaimAsString("username") : null;
        UserRole role = UserRole.valueOf(body.get("role").toUpperCase());
        UserResponseDto updatedUser = userService.updateUserRole(userId, role, actorId, actorUsername);
        return ResponseEntity.ok(updatedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping(path = "/{userId}/status")
    public ResponseEntity<UserResponseDto> toggleUserStatus(
            @PathVariable UUID userId,
            @RequestBody Map<String, Boolean> body,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID actorId = jwt != null ? UUID.fromString(jwt.getSubject()) : null;
        String actorUsername = jwt != null ? jwt.getClaimAsString("username") : null;
        Boolean active = body.get("active");
        UserResponseDto updatedUser = userService.toggleUserStatus(userId, active, actorId, actorUsername);
        return ResponseEntity.ok(updatedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(path = "/{userId}")
    public ResponseEntity<UserResponseDto> deactivateUser(
            @PathVariable UUID userId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID actorId = jwt != null ? UUID.fromString(jwt.getSubject()) : null;
        String actorUsername = jwt != null ? jwt.getClaimAsString("username") : null;
        UserResponseDto deactivatedUser = userService.toggleUserStatus(userId, false, actorId, actorUsername);
        return ResponseEntity.ok(deactivatedUser);
    }

    @GetMapping("/count/active")
    public ResponseEntity<Long> countActiveUsers(){
        long count = userService.countActiveUsers();
        return ResponseEntity.ok(count);
    }
}
