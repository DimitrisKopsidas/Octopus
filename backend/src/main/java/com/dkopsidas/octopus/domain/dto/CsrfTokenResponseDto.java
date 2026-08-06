package com.dkopsidas.octopus.domain.dto;

public record CsrfTokenResponseDto(
        String cookieName,
        String headerName
) {
}
