package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.entity.Answer;
import com.dkopsidas.octopus.domain.entity.Bundle;
import com.dkopsidas.octopus.domain.entity.Question;
import com.dkopsidas.octopus.exception.CourseNotFoundException;
import com.dkopsidas.octopus.mapper.QuestionMapper;
import com.dkopsidas.octopus.repository.BundleRepository;
import com.dkopsidas.octopus.repository.CourseRepository;
import com.dkopsidas.octopus.repository.QuestionRepository;
import com.dkopsidas.octopus.repository.UserRepository;
import com.dkopsidas.octopus.service.impl.ImageService;
import com.dkopsidas.octopus.service.impl.QuestionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UnsolvedQuestionsServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private QuestionMapper questionMapper;

    @Mock
    private ImageService imageService;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private BundleRepository bundleRepository;

    private QuestionServiceImpl questionService;

    private UUID userId;
    private Long courseId;
    private long nextAnswerId;

    // single-correct: answers 1 (correct), 2
    private Question single;
    // multi-correct: answers 3 (correct), 4 (correct), 5
    private Question multi;
    // true/false: answers 6 (correct), 7
    private Question trueFalse;

    @BeforeEach
    void setUp() {
        questionService = new QuestionServiceImpl(
                questionRepository,
                courseRepository,
                userRepository,
                questionMapper,
                imageService,
                eventPublisher,
                bundleRepository
        );
        userId = UUID.randomUUID();
        courseId = 1101L;
        nextAnswerId = 1;

        single = question(10L, true, false);
        multi = question(20L, true, true, false);
        trueFalse = question(30L, true, false);

        lenient().when(courseRepository.existsById(courseId)).thenReturn(true);
        lenient().when(questionRepository.findAllByCourseIdAndIsActiveTrue(courseId))
                .thenReturn(List.of(single, multi, trueFalse));
    }

    @Test
    void noHistory_IsEmpty() {
        givenBundles();

        assertTrue(unsolved().isEmpty());
    }

    @Test
    void onlyWrongAnswers_NotUnansweredOnes() {
        // single right, trueFalse wrong, multi only half picked (wrong); nothing else attempted
        givenBundles(bundle(answer(single, 0), answer(trueFalse, 1), answer(multi, 0)));

        List<Question> unsolved = unsolved();

        assertEquals(2, unsolved.size());
        assertTrue(unsolved.containsAll(List.of(multi, trueFalse)));
    }

    @Test
    void multiCorrect_NeedsEveryCorrectAndNoWrongPick() {
        givenBundles(
                bundle(answer(multi, 0)),                                  // only one of two correct
                bundle(answer(multi, 0), answer(multi, 1), answer(multi, 2)) // both correct plus a wrong one
        );
        assertEquals(List.of(multi), unsolved());

        givenBundles(bundle(answer(multi, 0), answer(multi, 1)));
        assertTrue(unsolved().isEmpty());
    }

    @Test
    void picksAreJudgedPerBundle_NotSummedAcrossBundles() {
        // each bundle holds one of the two correct answers: neither attempt was right
        givenBundles(bundle(answer(multi, 0)), bundle(answer(multi, 1)));

        assertEquals(List.of(multi), unsolved());
    }

    @Test
    void wrongThenRight_LeavesThePool() {
        givenBundles(
                bundle(answer(single, 1), answer(trueFalse, 1)),
                bundle(answer(trueFalse, 0))
        );

        assertEquals(List.of(single), unsolved());
    }

    @Test
    void rightThenWrong_StaysOutOfThePool() {
        givenBundles(bundle(answer(single, 0)), bundle(answer(single, 1)));

        assertTrue(unsolved().isEmpty());
    }

    @Test
    void emptyOnceEveryMistakeIsFixed() {
        givenBundles(
                bundle(answer(single, 1), answer(multi, 2)),
                bundle(answer(single, 0), answer(multi, 0), answer(multi, 1))
        );

        assertTrue(unsolved().isEmpty());
    }

    @Test
    void deactivatedQuestion_IsIgnored() {
        Question deactivated = question(40L, true, false);
        givenBundles(bundle(answer(deactivated, 1)));

        assertTrue(unsolved().isEmpty());
    }

    @Test
    void unknownCourse_Throws() {
        when(courseRepository.existsById(courseId)).thenReturn(false);

        assertThrows(CourseNotFoundException.class, () -> questionService.getUnsolvedQuestions(courseId, userId));
        verifyNoInteractions(bundleRepository);
    }

    /** Runs getUnsolvedQuestions and returns the questions handed to the mapper. */
    private List<Question> unsolved() {
        List<Question> mapped = new ArrayList<>();
        lenient().when(questionMapper.toDto(any(Question.class))).thenAnswer(inv -> {
            mapped.add(inv.getArgument(0));
            return null;
        });
        questionService.getUnsolvedQuestions(courseId, userId);
        return mapped;
    }

    private void givenBundles(Bundle... bundles) {
        when(bundleRepository.findAllByUserIdAndCourseId(userId, courseId)).thenReturn(List.of(bundles));
    }

    private Question question(Long id, boolean... correctFlags) {
        Question question = new Question();
        question.setId(id);
        for (boolean correct : correctFlags) {
            Answer answer = new Answer();
            answer.setId(nextAnswerId++);
            answer.setCorrect(correct);
            question.addAnswer(answer);
        }
        return question;
    }

    private Answer answer(Question question, int index) {
        return question.getAnswers().get(index);
    }

    private Bundle bundle(Answer... answers) {
        Bundle bundle = new Bundle();
        for (Answer answer : answers) {
            bundle.addAnswer(answer);
        }
        return bundle;
    }
}
