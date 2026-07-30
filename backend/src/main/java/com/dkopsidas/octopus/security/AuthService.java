package com.dkopsidas.octopus.security;

import com.dkopsidas.octopus.domain.dto.AuthResponseDto;
import com.dkopsidas.octopus.domain.dto.LoginRequestDto;
import com.dkopsidas.octopus.domain.dto.UserResponseDto;
import com.dkopsidas.octopus.domain.entity.RefreshToken;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.exception.InactiveAccountException;
import com.dkopsidas.octopus.exception.InvalidCredentialsException;
import com.dkopsidas.octopus.mapper.UserMapper;
import com.dkopsidas.octopus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String BEARER_TOKEN_TYPE = "Bearer";

    private final AuthenticationManager authenticationManager;
    private final AccessTokenService accessTokenService;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional
    public LoginResult login(LoginRequestDto loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(
                            loginRequest.username().trim(),
                            loginRequest.password()
                    )
            );
        } catch (AuthenticationException exception) {
            throw new InvalidCredentialsException();
        }

        if (!(authentication.getPrincipal() instanceof AuthenticatedUser principal)) {
            throw new IllegalStateException("Unexpected authenticated principal type");
        }

        User user = userRepository.findById(principal.getId())
                .filter(User::isActive)
                .orElseThrow(InvalidCredentialsException::new);
        IssuedAccessToken accessToken = accessTokenService.issueFor(user);
        IssuedRefreshToken refreshToken = refreshTokenService.issueFor(user);

        return new LoginResult(toResponse(accessToken, user), refreshToken);
    }

    @Transactional(readOnly = true)
    public AuthResponseDto refresh(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenService.requireValid(refreshTokenValue);
        User user = refreshToken.getUser();
        requireActive(user);

        return toResponse(accessTokenService.issueFor(user), user);
    }

    public void logout(String refreshTokenValue) {
        refreshTokenService.revoke(refreshTokenValue);
    }

    @Transactional(readOnly = true)
    public UserResponseDto currentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(InactiveAccountException::new);
        requireActive(user);
        return userMapper.toDto(user);
    }

    private AuthResponseDto toResponse(IssuedAccessToken accessToken, User user) {
        return new AuthResponseDto(
                accessToken.value(),
                BEARER_TOKEN_TYPE,
                accessToken.expiresIn(),
                userMapper.toDto(user)
        );
    }

    private void requireActive(User user) {
        if (!user.isActive()) {
            throw new InactiveAccountException();
        }
    }
}
