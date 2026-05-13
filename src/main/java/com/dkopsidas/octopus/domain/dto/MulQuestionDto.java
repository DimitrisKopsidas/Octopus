package com.dkopsidas.octopus.domain.dto;

import com.dkopsidas.octopus.domain.entity.MulAnswer;

import java.util.List;

public record MulQuestionDto(
        Long id,
        String title,
        List<MulAnswer> mulAnswers,
        Long courseId//should this be here or ID? jimbo
) {
}
