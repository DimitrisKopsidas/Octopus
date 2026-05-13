package com.dkopsidas.octopus.domain.dto;

import com.dkopsidas.octopus.domain.entity.Answer;

import java.util.List;

public record QuestionDto(
        Long id,
        String title,
        List<Answer> answers,
        Long courseId//should this be here or ID? jimbo
) {
}
