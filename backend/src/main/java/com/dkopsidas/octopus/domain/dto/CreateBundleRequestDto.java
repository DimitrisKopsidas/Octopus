package com.dkopsidas.octopus.domain.dto;

import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateBundleRequestDto(
        Integer setNum,
        Integer timeForCompletion,
        @Size(min = 1, message = ERROR_MESSAGE_ANSWER_COUNT)
        List<Long> answerIds
) {
    private static final String ERROR_MESSAGE_ANSWER_COUNT = "Bundle must contain at least one answer";
}
