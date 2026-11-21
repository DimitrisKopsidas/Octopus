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
        for (int i = 0; i < questions.size(); i++) {
            attempt.addQuestion(new AttemptQuestion(questions.get(i), i));
        }
        QuizAttempt saved = attemptRepository.save(attempt);

        Map<Long, List<Answer>> answers = activeAnswersByQuestion(questions.stream().map(Question::getId).toList());
        List<AttemptQuestionDto> questionDtos = questions.stream()
                .map(q -> new AttemptQuestionDto(q.getId(), q.getTitle(), q.getImageUrl(),
                        answers.getOrDefault(q.getId(), List.of()).stream()
                                .map(a -> new AttemptAnswerDto(a.getId(), a.getTitle()))
                                .toList()))
                .toList();
        return new AttemptStartResponseDto(saved.getId(), saved.getCourse().getId(), saved.getExamType(),
                saved.getSetNum(), saved.getExpiresAt(), questionDtos);
    }

    @Override
    @Transactional
    public AttemptResultDto submit(UUID attemptId, SubmitAttemptRequestDto dto, UUID userId) {
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
        if (!served.keySet().containsAll(dto.answers().keySet())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Answer for a question not in this attempt");
        }
        Map<Long, List<Answer>> answers = activeAnswersByQuestion(served.keySet());

        int correctCount = 0;
        List<QuestionResultDto> results = new ArrayList<>();
        for (AttemptQuestion aq : attempt.getQuestions()) {
            Long questionId = aq.getQuestion().getId();
            Map<Long, Answer> options = answers.getOrDefault(questionId, List.of()).stream()
                    .collect(Collectors.toMap(Answer::getId, a -> a));
            Set<Long> picked = Objects.requireNonNullElse(dto.answers().get(questionId), Set.of());
            for (Long answerId : picked) {
                Answer answer = options.get(answerId);
                if (answer == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Answer " + answerId + " is not an option of question " + questionId);
                }
                aq.addSelectedAnswer(answer);
            }
            Set<Long> correctIds = options.values().stream()
                    .filter(Answer::getIsCorrect).map(Answer::getId).collect(Collectors.toSet());
            // all-or-nothing, skipped = wrong
            boolean correct = !picked.isEmpty() && picked.equals(correctIds);
            aq.setCorrect(correct);
            if (correct) correctCount++;
            results.add(new QuestionResultDto(questionId, correct,
                    picked.stream().sorted().toList(), correctIds.stream().sorted().toList()));
        }
        attempt.setCorrectCount(correctCount);
        attempt.setFinishedAt(now);

        if (attempt.getUser() != null) {
            badgeEvaluationService.evaluateQuizMilestones(attempt.getUser().getId());
        }
        return new AttemptResultDto(attempt.getId(), correctCount, attempt.getQuestionCount(), now, results);
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

        // question, {answers}
        Map<Long, List<Answer>> active = activeAnswersByQuestion(
                attempt.getQuestions().stream().map(aq -> aq.getQuestion().getId()).toList());

        List<AttemptReviewQuestionDto> questions = attempt.getQuestions().stream().map(aq -> {
            
            Question q = aq.getQuestion();
            
            List<Answer> options = new ArrayList<>(active.getOrDefault(q.getId(), List.of()));            
            
            Set<Long> picked = new HashSet<>();
            for (AttemptAnswer selected : aq.getSelectedAnswers()) {
                picked.add(selected.getAnswer().getId());
                if (!selected.getAnswer().isActive()) {
                    options.add(selected.getAnswer());
                }
            }
            List<AttemptReviewAnswerDto> answers = options.stream()
                    .map(a -> new AttemptReviewAnswerDto(a.getId(), a.getTitle(), a.getIsCorrect(), picked.contains(a.getId())))
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
