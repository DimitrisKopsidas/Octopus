package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.entity.Answer;
import com.dkopsidas.octopus.domain.dto.CreateQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.QuestionResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateQuestionRequestDto;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.Question;
import com.dkopsidas.octopus.exception.CorrectAnswerCountException;
import com.dkopsidas.octopus.exception.CourseNotFoundException;
import com.dkopsidas.octopus.exception.QuestionNotFoundException;
import com.dkopsidas.octopus.mapper.QuestionMapper;
import com.dkopsidas.octopus.repository.CourseRepository;
import com.dkopsidas.octopus.repository.QuestionRepository;
import com.dkopsidas.octopus.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@RequiredArgsConstructor
@Service
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final CourseRepository courseRepository;
    private final QuestionMapper questionMapper;

    @Override
    public QuestionResponseDto createQuestion(CreateQuestionRequestDto createRequest) {
        Course courseFromDto = courseRepository.findById(createRequest.courseId()).orElseThrow(() -> new CourseNotFoundException(createRequest.courseId()));

        Question question = questionMapper.toEntity(createRequest, courseFromDto);

        checkCorrectAnswerCount(question);

        return questionMapper.toDto(questionRepository.save(question));
    }

    @Override
    public List<QuestionResponseDto> listQuestions(Long courseId) {
        return questionMapper.toDto(questionRepository.findAllByCourseId(courseId));
    }

    @Override
    public QuestionResponseDto updateQuestion(Long questionId, UpdateQuestionRequestDto updateRequest) {
        Question question = questionRepository.findById(questionId).orElseThrow(() -> new QuestionNotFoundException(questionId));
        Question questionFromDto = questionMapper.toEntity(updateRequest);

        checkCorrectAnswerCount(questionFromDto);

        question.setTitle(questionFromDto.getTitle());
        question.replaceAnswers(questionFromDto.getAnswers());

        return questionMapper.toDto(questionRepository.save(question));
    }

    @Override
    public void deleteQuestion(Long questionId) {
        questionRepository.deleteById(questionId);
    }

    private void checkCorrectAnswerCount(Question question) {
        long correctCount = question.getAnswers().stream()
                .filter(Answer::getIsCorrect)
                .count();

        if (correctCount != 1) {
            throw new CorrectAnswerCountException(question.getId());
        }
    }

    public Long countQuestions(Long courseId) {
        return questionRepository.countByCourseId(courseId);
    }
}
