package com.dkopsidas.octopus.service.v2.impl;

import com.dkopsidas.octopus.domain.dto.v2.*;
import com.dkopsidas.octopus.service.v2.QuizAttemptService;
import com.dkopsidas.octopus.domain.entity.*;
import com.dkopsidas.octopus.repository.*;
import com.dkopsidas.octopus.service.BadgeEvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class QuizAttemptServiceImpl implements QuizAttemptService {

    private final QuizAttemptRepository attemptRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final BadgeEvaluationService badgeEvaluationService;

    @Override
    @Transactional
    public AttemptStartResponseDto startQuizAttempt(UUID quizId, Integer timerMinutes, UUID userId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));
        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuiz(quiz);
        attempt.setCourse(quiz.getCourse());
        attempt.setExamType(quiz.getExamType());
        attempt.setSetNum(quiz.getSetNum());
        return start(attempt, quizRepository.findActiveQuestions(quizId), timerMinutes, userId);
    }

    @Override
    @Transactional
    public AttemptStartResponseDto startCustomAttempt(Long courseId, StartCustomAttemptRequestDto dto, UUID userId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }
        QuizAttempt attempt = new QuizAttempt();
        attempt.setCourse(courseRepository.getReferenceById(courseId));
        attempt.setExamType(dto.examType());
        List<Question> questions = questionRepository.findRandomActive(courseId, dto.examType().name(), dto.count());
        return start(attempt, questions, dto.timerMinutes(), userId);
    }

    private AttemptStartResponseDto start(QuizAttempt attempt, List<Question> questions, Integer timerMinutes, UUID userId) {
        if (questions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No active questions to serve");
        }
        Instant now = Instant.now();
        attempt.setUser(userId == null ? null : userRepository.getReferenceById(userId));
        attempt.setQuestionCount(questions.size());
        attempt.setStartedAt(now);
        attempt.setExpiresAt(timerMinutes == null ? null : now.plus(Duration.ofMinutes(timerMinutes)));
        Map<Long, List<Answer>> answers = activeAnswersByQuestion(questions.stream().map(Question::getId).toList());
        for (int i = 0; i < questions.size(); i++) {
            AttemptQuestion aq = new AttemptQuestion(questions.get(i), i);
            answers.getOrDefault(questions.get(i).getId(), List.of()).forEach(aq::addOption);
            attempt.addQuestion(aq);
        }
        QuizAttempt saved = attemptRepository.save(attempt);

        List<AttemptQuestionDto> questionDtos = questions.stream()
                .map(q -> {
                    List<Answer> options = answers.getOrDefault(q.getId(), List.of());
                    boolean multiSelect = options.stream().filter(Answer::getIsCorrect).count() > 1;
                    return new AttemptQuestionDto(q.getId(), q.getTitle(), q.getImageUrl(), multiSelect,
                            options.stream().map(a -> new AttemptAnswerDto(a.getId(), a.getTitle())).toList());
                })
                .toList();
        return new AttemptStartResponseDto(saved.getId(), saved.getCourse().getId(), saved.getExamType(),
                saved.getSetNum(), saved.getExpiresAt(), questionDtos);
    }

    @Override
    @Transactional
    public AttemptDetailDto submit(UUID attemptId, SubmitAttemptRequestDto dto, UUID userId) {
        QuizAttempt attempt = attemptRepository.findWithQuestionsById(attemptId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Attempt not found"));

        if (attempt.getUser() != null && !attempt.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Attempt not found");
        }
        if (attempt.isFinished()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Attempt already submitted");
        }

        Instant now = Instant.now();

        Map<Long, AttemptQuestion> served = attempt.getQuestions().stream()
                .collect(Collectors.toMap(aq -> aq.getQuestion().getId(), aq -> aq));
        // all served questionIds should match the submitted questionIds
        if (!served.keySet().containsAll(dto.answers().keySet())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Answer for a question not in this attempt");
        }
        int correctCount = 0;
        for (AttemptQuestion aq : attempt.getQuestions()) {
            // for each attempt question, get question and all it's answer options
            Long questionId = aq.getQuestion().getId();
            Map<Long, AttemptAnswer> options = aq.getOptions().stream()
                    .collect(Collectors.toMap(o -> o.getAnswer().getId(), o -> o));

            // find what user picked
            Set<Long> picked = Objects.requireNonNullElse(dto.answers().get(questionId), Set.of());
            for (Long answerId : picked) {
                AttemptAnswer option = options.get(answerId);
                if (option == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Answer " + answerId + " is not an option of question " + questionId);
                }
                option.setSelected(true);
            }

            // all correct answer Ids
            Set<Long> correctIds = options.values().stream()
                    .filter(o -> o.getAnswer().getIsCorrect())
                    .map(o -> o.getAnswer().getId())
                    .collect(Collectors.toSet());

            // all-or-nothing, skipped = wrong
            boolean correct = !picked.isEmpty() && picked.equals(correctIds);
            aq.setCorrect(correct);
            if (correct) correctCount++;
        }
        attempt.setCorrectCount(correctCount);
        attempt.setFinishedAt(now);

        if (attempt.getUser() != null) {
            badgeEvaluationService.evaluateQuizMilestones(attempt.getUser().getId());
        }
        return toDetail(attempt);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttemptSummaryDto> listUserAttempts(UUID userId, Pageable pageable) {
        return attemptRepository.findByUserIdAndFinishedAtIsNotNull(userId, pageable).map(this::toSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public AttemptDetailDto getUserAttempt(UUID attemptId, UUID userId) {
        QuizAttempt attempt = attemptRepository.findWithQuestionsById(attemptId)
                .filter(a -> a.getUser() != null && a.getUser().getId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Attempt not found"));

        if (!attempt.isFinished()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Attempt not submitted yet");
        }
        return toDetail(attempt);
    }

    private AttemptDetailDto toDetail(QuizAttempt attempt) {
        List<AttemptReviewQuestionDto> questions = attempt.getQuestions().stream().map(aq -> {
            Question q = aq.getQuestion();
            List<AttemptReviewAnswerDto> answers = aq.getOptions().stream()
                    .sorted(Comparator.comparing(o -> o.getAnswer().getId()))
                    .map(o -> new AttemptReviewAnswerDto(o.getAnswer().getId(), o.getAnswer().getTitle(),
                            o.getAnswer().getIsCorrect(), o.isSelected()))
                    .toList();
            return new AttemptReviewQuestionDto(q.getId(), q.getTitle(), q.getImageUrl(),
                    Boolean.TRUE.equals(aq.getCorrect()), answers);
        }).toList();

        return new AttemptDetailDto(toSummary(attempt), questions);
    }

    private AttemptSummaryDto toSummary(QuizAttempt a) {
        return new AttemptSummaryDto(a.getId(), a.getCourse().getId(), a.getCourse().getName(),
                a.getQuiz() == null ? null : a.getQuiz().getId(), a.getExamType(), a.getSetNum(),
                a.getCorrectCount(), a.getQuestionCount(), a.getStartedAt(), a.getFinishedAt(),
                a.getExpiresAt(), a.isLate());
    }

    private Map<Long, List<Answer>> activeAnswersByQuestion(Collection<Long> questionIds) {
        return answerRepository.findByQuestionIdInAndActiveTrueOrderByIdAsc(questionIds).stream()
                .collect(Collectors.groupingBy(a -> a.getQuestion().getId()));
    }
}
