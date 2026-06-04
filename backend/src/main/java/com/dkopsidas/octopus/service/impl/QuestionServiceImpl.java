package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.SettingsInfoResponseDto;
import com.dkopsidas.octopus.domain.entity.Answer;
import com.dkopsidas.octopus.domain.dto.CreateQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.QuestionResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateQuestionRequestDto;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.Question;
import com.dkopsidas.octopus.exception.CorrectAnswerCountException;
import com.dkopsidas.octopus.exception.CourseNotFoundException;
import com.dkopsidas.octopus.exception.QuestionNotFoundException;
import com.dkopsidas.octopus.exception.SimpleException;
import com.dkopsidas.octopus.mapper.QuestionMapper;
import com.dkopsidas.octopus.repository.CourseRepository;
import com.dkopsidas.octopus.repository.QuestionRepository;
import com.dkopsidas.octopus.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
@Service
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final CourseRepository courseRepository;
    private final QuestionMapper questionMapper;

    @Override
    public QuestionResponseDto createQuestion(CreateQuestionRequestDto createRequest) {
        Course courseFromDto = courseRepository.findById(createRequest.courseId()).
                orElseThrow(() -> new CourseNotFoundException(createRequest.courseId()));

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
        Question question = questionRepository.findById(questionId).
                orElseThrow(() -> new QuestionNotFoundException(questionId));
        Question questionFromDto = questionMapper.toEntity(updateRequest);

        checkCorrectAnswerCount(questionFromDto);

        question.setTitle(questionFromDto.getTitle());
        question.setImageUrl(questionFromDto.getImageUrl());
        question.replaceAnswers(questionFromDto.getAnswers());

        return questionMapper.toDto(questionRepository.save(question));
    }

    @Override
    public void deleteQuestion(Long questionId) {
        questionRepository.deleteById(questionId);
    }

    @Override
    public SettingsInfoResponseDto listSettingsInfo(Long courseId) {
        Course courseFromDto = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException(courseId));

        return new SettingsInfoResponseDto(
                questionRepository.countByCourseId(courseId),
                courseFromDto.getQuestionSetSize(),
                courseFromDto.getDefaultTimerMinutes()
        );
    }

    public List<QuestionResponseDto> listQuestionsBySetNum(Long courseId, Integer setNum) {
        Course courseFromDto = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));

        int setSize = courseFromDto.getQuestionSetSize();
        int fromIndex = setNum * setSize;

        List<Question> allQuestions = questionRepository.findAllByCourseId(courseId);

        if (fromIndex >= allQuestions.size()) {
            throw new SimpleException("Set number " + setNum + " does not exist for this course");
        }

        int toIndex = Math.min(fromIndex + setSize, allQuestions.size());

        return questionMapper.toDto(scrambleQuestions(allQuestions.subList(fromIndex, toIndex)));
    }

    @Override
    public List<QuestionResponseDto> listQuestionsByRandomCount(Long courseId, Integer randomCount) {
        Course courseFromDto = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));

        List<Question> allQuestions = questionRepository.findAllByCourseId(courseId);

        if (randomCount > allQuestions.size())
            throw new SimpleException("Random count: " + randomCount + " exceeds the total question count for this course");

        allQuestions = scrambleQuestions(allQuestions);

        return questionMapper.toDto(allQuestions.subList(0, randomCount));
    }

    private void checkCorrectAnswerCount(Question question) {
        long correctCount = question.getAnswers().stream()
                .filter(Answer::getIsCorrect)
                .count();

        if (correctCount == 0) {
            throw new CorrectAnswerCountException(question.getId());
        }
    }

    public List<Question> scrambleQuestions(List<Question> questions) {
        List<Question> scrambled = new ArrayList<>(questions);
        Collections.shuffle(scrambled);
        return scrambled;
    }
}
