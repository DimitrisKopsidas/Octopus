package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.AccessDemoResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AccessDemoController {

    @GetMapping("/healthz")
    public ResponseEntity<AccessDemoResponseDto> healthz() {
        return ResponseEntity.ok(
                new AccessDemoResponseDto(
                        "healthz",
                        "PUBLIC",
                        null,
                        List.of()
                )
        );
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/access/student")
    public ResponseEntity<AccessDemoResponseDto> student(
            @AuthenticationPrincipal Jwt jwt
    ) {
        return ResponseEntity.ok(responseFor("student", "STUDENT", jwt));
    }

    @PreAuthorize("hasRole('HELPER')")
    @GetMapping("/access/helper")
    public ResponseEntity<AccessDemoResponseDto> helper(
            @AuthenticationPrincipal Jwt jwt
    ) {
        return ResponseEntity.ok(responseFor("helper", "HELPER", jwt));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/access/admin")
    public ResponseEntity<AccessDemoResponseDto> admin(
            @AuthenticationPrincipal Jwt jwt
    ) {
        return ResponseEntity.ok(responseFor("admin", "ADMIN", jwt));
    }

    private AccessDemoResponseDto responseFor(
            String endpoint,
            String requiredRole,
            Jwt jwt
    ) {
        return new AccessDemoResponseDto(
                endpoint,
                requiredRole,
                jwt.getSubject(),
                jwt.getClaimAsStringList("authorities")
        );
    }
}
