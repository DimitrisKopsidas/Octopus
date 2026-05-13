package com.dkopsidas.octopus.domain;

import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.MulAnswer;

import java.util.List;

public record CreateMulQuestionRequest(
        String title,
        List<MulAnswer> mulAnswers,
        Long courseId
) {

}
