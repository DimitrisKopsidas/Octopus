package com.dkopsidas.octopus.domain.dto;

import java.time.Instant;
import java.util.List;

public record BundleResponseDto(
        Long id,
        Integer setNum,
        int score,
        List<AnswerResponseDto> answers,
        Instant created
) {}
