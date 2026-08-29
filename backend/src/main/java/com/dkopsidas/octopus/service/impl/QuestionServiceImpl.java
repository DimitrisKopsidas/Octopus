package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.SettingsInfoResponseDto;
import com.dkopsidas.octopus.domain.entity.Answer;
import com.dkopsidas.octopus.domain.entity.AuditAction;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.Question;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.domain.dto.CreateQuestionRequestDto;
import com.dkopsidas.octopus.domain.dto.QuestionResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateQuestionRequestDto;
import com.dkopsidas.octopus.exception.CorrectAnswerCountException;
import com.dkopsidas.octopus.exception.CourseNotFoundException;
import com.dkopsidas.octopus.exception.QuestionNotFoundException;
import com.dkopsidas.octopus.exception.SimpleException;
import com.dkopsidas.octopus.mapper.QuestionMapper;
import com.dkopsidas.octopus.repository.CourseRepository;
import com.dkopsidas.octopus.repository.QuestionRepository;
import com.dkopsidas.octopus.repository.UserRepository;
import com.dkopsidas.octopus.service.QuestionService;
import lombok.RequiredArgsConstructor;
import com.dkopsidas.octopus.security.audit.AuditEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Transactional at class level on purpose. spring.jpa.open-in-view is disabled,
 * so without a transaction the persistence context closes the moment a
 * repository call returns — and QuestionMapper then reads question.getAnswers()
 * and question.getCourse(), both lazy, which threw LazyInitializationException
 * on every read endpoint here.
 */
@RequiredArgsConstructor
@Service
@Transactional
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final QuestionMapper questionMapper;
    private final ImageService imageService;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public QuestionResponseDto createQuestion(CreateQuestionRequestDto createRequest) {
        Course courseFromDto = courseRepository.findById(createRequest.courseId())
                .orElseThrow(() -> new CourseNotFoundException(createRequest.courseId()));

        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User userRef = userRepository.getReferenceById(UUID.fromString(jwt.getSubject()));

        Question question = questionMapper.toEntity(createRequest, courseFromDto);
        question.setCreatedBy(userRef);

        checkCorrectAnswerCount(question);

        Question saved = questionRepository.save(question);

        eventPublisher.publishEvent(AuditEvent.success(
                null,
                null,
                AuditAction.QUESTION_CREATED,
                "QUESTION",
                saved.getId().toString(),
                "Created question in course " + courseFromDto.getId()
        ));

        return questionMapper.toDto(saved);
    }

    @Override
    public List<QuestionResponseDto> listQuestions(Long courseId) {
        return questionMapper.toDto(questionRepository.findAllByCourseIdAndIsActiveTrue(courseId));
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

        Question saved = questionRepository.save(question);

        eventPublisher.publishEvent(AuditEvent.success(
                null,
                null,
                AuditAction.QUESTION_UPDATED,
                "QUESTION",
                saved.getId().toString(),
                "Updated question titled: " + saved.getTitle()
        ));

        return questionMapper.toDto(saved);
    }

    @Override
    public QuestionResponseDto deactivateQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId).
                orElseThrow(() -> new QuestionNotFoundException(questionId));

        question.setIsActive(false);
        Question saved = questionRepository.save(question);

        eventPublisher.publishEvent(AuditEvent.success(
                null,
                null,
                AuditAction.QUESTION_DEACTIVATED,
                "QUESTION",
                saved.getId().toString(),
                "Deactivated question"
        ));

        return questionMapper.toDto(saved);
    }

    @Override
    public SettingsInfoResponseDto listSettingsInfo(Long courseId) {
        Course courseFromDto = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException(courseId));

        return new SettingsInfoResponseDto(
                questionRepository.countByCourseIdAndIsActiveTrue(courseId),
                courseFromDto.getQuestionSetSize(),
                courseFromDto.getDefaultTimerMinutes()
        );
    }

    public List<QuestionResponseDto> listQuestionsBySetNum(Long courseId, Integer setNum) {
        Course courseFromDto = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));

        int setSize = courseFromDto.getQuestionSetSize();
        int fromIndex = setNum * setSize;

        List<Question> allQuestions = questionRepository.findAllByCourseIdAndIsActiveTrue(courseId);

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

        List<Question> allQuestions = questionRepository.findAllByCourseIdAndIsActiveTrue(courseId);

        if (randomCount > allQuestions.size())
            throw new SimpleException("Random count: " + randomCount + " exceeds the total question count for this course");

        allQuestions = scrambleQuestions(allQuestions);

        return questionMapper.toDto(allQuestions.subList(0, randomCount));
    }

    public QuestionResponseDto uploadImage(Long questionId, MultipartFile file) throws IOException {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new QuestionNotFoundException(questionId));

        String imageUrl = imageService.saveImage(questionId, file);
        question.setImageUrl(imageUrl);
        Question saved = questionRepository.save(question);

        eventPublisher.publishEvent(AuditEvent.success(
                null,
                null,
                AuditAction.QUESTION_IMAGE_UPLOADED,
                "QUESTION",
                saved.getId().toString(),
                "Uploaded image for question " + questionId
        ));

        return questionMapper.toDto(saved);
    }

    public QuestionResponseDto deleteImage(Long questionId) throws IOException {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new QuestionNotFoundException(questionId));

        imageService.deleteImage(questionId);
        question.setImageUrl(null);
        Question saved = questionRepository.save(question);

        eventPublisher.publishEvent(AuditEvent.success(
                null,
                null,
                AuditAction.QUESTION_IMAGE_DELETED,
                "QUESTION",
                saved.getId().toString(),
                "Deleted image for question " + questionId
        ));

        return questionMapper.toDto(saved);
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
