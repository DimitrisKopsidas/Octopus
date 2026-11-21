package com.dkopsidas.octopus.domain.dto.v2;

import java.util.List;

/** A submitted attempt with every served question, what the user picked and the correct answers. */
public record AttemptDetailDto(
        AttemptSummaryDto attempt,
        List<AttemptReviewQuestionDto> questions
) {
}
