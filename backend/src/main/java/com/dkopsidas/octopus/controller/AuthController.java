package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.AuthResponseDto;
import com.dkopsidas.octopus.domain.dto.CsrfTokenResponseDto;
import com.dkopsidas.octopus.domain.dto.LoginRequestDto;
import com.dkopsidas.octopus.domain.dto.UserResponseDto;
import com.dkopsidas.octopus.exception.MissingRefreshTokenException;
import com.dkopsidas.octopus.security.AuthService;
import com.dkopsidas.octopus.security.LoginResult;
import com.dkopsidas.octopus.security.RefreshTokenCookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final String CSRF_COOKIE_NAME = "XSRF-TOKEN";

    private final AuthService authService;
    private final RefreshTokenCookieService refreshTokenCookieService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(
            @Valid @RequestBody LoginRequestDto loginRequest,
            HttpServletResponse response
    ) {
        LoginResult loginResult = authService.login(loginRequest);
        refreshTokenCookieService.add(response, loginResult.refreshToken());
        return ResponseEntity.ok(loginResult.response());
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refresh(HttpServletRequest request) {
        String refreshToken = refreshTokenCookieService.read(request)
                .orElseThrow(MissingRefreshTokenException::new);
        return ResponseEntity.ok(authService.refresh(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        refreshTokenCookieService.read(request).ifPresent(authService::logout);
        refreshTokenCookieService.clear(response);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> me(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(
                authService.currentUser(UUID.fromString(jwt.getSubject()))
        );
    }

    @GetMapping("/csrf")
    public ResponseEntity<CsrfTokenResponseDto> csrf(CsrfToken csrfToken) {
        csrfToken.getToken();
        return ResponseEntity.ok(
                new CsrfTokenResponseDto(CSRF_COOKIE_NAME, csrfToken.getHeaderName())
        );
    }
}
