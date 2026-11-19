package com.dkopsidas.octopus.domain.dto.v2;

import java.util.List;

/** A served question. No correctness info: that only goes out in the submit result. */
public record AttemptQuestionDto(
        Long id,
        String title,
        String imageUrl,
        List<AttemptAnswerDto> answers
) {
}
