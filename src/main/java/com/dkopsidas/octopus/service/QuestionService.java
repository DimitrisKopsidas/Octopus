package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.CreateQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.QuestionResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateQuestionRequestDto;
import com.dkopsidas.octopus.domain.entity.Question;

import java.util.List;

public interface QuestionService {

    QuestionResponseDto createQuestion(CreateQuestionRequestDto dto);

    List<QuestionResponseDto> listQuestions(Long courseId);

    QuestionResponseDto updateQuestion(Long questionId, UpdateQuestionRequestDto dto);

    void deleteQuestion(Long questionId);

}
