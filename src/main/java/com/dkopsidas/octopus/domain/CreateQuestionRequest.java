package com.dkopsidas.octopus.domain;

import com.dkopsidas.octopus.domain.entity.Answer;

import java.util.List;

public record CreateQuestionRequest(
        String title,
        List<Answer> answers,
        Long courseId
) {

}
