package com.dkopsidas.octopus.domain.dto.v2;

import jakarta.validation.constraints.NotNull;

import java.util.Map;
import java.util.Set;

public record SubmitAttemptRequestDto(
        @NotNull
        Map<Long, Set<Long>> answers
) {
}
