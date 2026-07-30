package com.dkopsidas.octopus.domain.dto;

import java.util.List;

public record AccessDemoResponseDto(
        String endpoint,
        String requiredRole,
        String subject,
        List<String> authorities
) {
}
