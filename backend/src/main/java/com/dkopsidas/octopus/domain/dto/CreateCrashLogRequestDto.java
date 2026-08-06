package com.dkopsidas.octopus.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCrashLogRequestDto(
        @NotBlank(message = "Exception class is required")
        @Size(max = 255)
        String exceptionClass,

        @Size(max = 2000)
        String message,

        String stackTrace,

        @Size(max = 500)
        String requestUri,

        @Size(max = 10)
        String httpMethod,

        Integer statusCode
) {}
