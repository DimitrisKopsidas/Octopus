package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.CreateMulQuestionRequest;
import com.dkopsidas.octopus.domain.UpdateMulQuestionRequest;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.MulQuestion;

import java.util.List;

public interface MulQuestionService {

    MulQuestion createMulQuestion(CreateMulQuestionRequest request);

    List<MulQuestion> listMulQuestions(Course course);

    MulQuestion updateMulQuestion(Long mulQuestionId, UpdateMulQuestionRequest request);

    void deleteMulQuestion(Long mulQuestionId);

}
