package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.CreateQuestionRequest;
import com.dkopsidas.octopus.domain.UpdateQuestionRequest;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.Question;

import java.util.List;

public interface QuestionService {

    Question createQuestion(CreateQuestionRequest request);

    List<Question> listQuestions(Course course);

    Question updateQuestion(Long questionId, UpdateQuestionRequest request);

    void deleteQuestion(Long questionId);

}
