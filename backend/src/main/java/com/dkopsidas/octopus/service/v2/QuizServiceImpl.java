package com.dkopsidas.octopus.service.v2;

import com.dkopsidas.octopus.domain.dto.v2.*;
import com.dkopsidas.octopus.domain.entity.Answer;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.Question;
import com.dkopsidas.octopus.domain.entity.Quiz;
import com.dkopsidas.octopus.repository.AnswerRepository;
import com.dkopsidas.octopus.repository.CourseRepository;
import com.dkopsidas.octopus.repository.QuestionRepository;
import com.dkopsidas.octopus.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    @Override
    @Transactional
    public QuizResponseDto createQuiz(QuizRequestDto dto) {
        Course course = courseRepository.findById(dto.courseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        if (quizRepository.existsByCourseIdAndExamTypeAndSetNum(course.getId(), dto.examType(), dto.setNum())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This set already exists");
        }

        Quiz quiz = new Quiz();
        quiz.setCourse(course);
        quiz.setExamType(dto.examType());
        quiz.setSetNum(dto.setNum());
        quiz.replaceQuestions(loadValidQuestions(dto));
        Quiz saved = quizRepository.save(quiz);

        return new QuizResponseDto(saved.getId(), course.getId(), saved.getExamType(), saved.getSetNum(),
                saved.getQuestions().size(), saved.getUpdated());
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizResponseDto> listQuizzes(Long courseId) {
        return quizRepository.findListByCourseId(courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public QuizDetailDto getQuiz(UUID quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));
        List<Question> questions = quizRepository.findActiveQuestions(quizId);
        Map<Long, List<Answer>> answers = answerRepository
                .findByQuestionIdInAndActiveTrueOrderByIdAsc(questions.stream().map(Question::getId).toList())
                .stream()
                .collect(Collectors.groupingBy(a -> a.getQuestion().getId()));

        List<QuizQuestionDto> questionDtos = questions.stream()
                .map(q -> new QuizQuestionDto(q.getId(), q.getTitle(), q.getImageUrl(),
                        answers.getOrDefault(q.getId(), List.of()).stream()
                                .map(a -> new QuizAnswerDto(a.getId(), a.getTitle(), a.getIsCorrect()))
                                .toList()))
                .toList();
        return new QuizDetailDto(quiz.getId(), quiz.getCourse().getId(), quiz.getExamType(), quiz.getSetNum(), questionDtos);
    }

    @Override
    @Transactional
    public QuizResponseDto replaceQuiz(UUID quizId, QuizRequestDto dto) {
        Quiz old = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));
        quizRepository.delete(old);
        // Hibernate runs inserts before deletes, so without this the new row clashes on (course, exam_type, set_num)
        quizRepository.flush();
        return createQuiz(dto);
    }

    /**
     * The dto's questions in its order. 400 if any is missing, duplicated, inactive, or from another course.
     */
    private List<Question> loadValidQuestions(QuizRequestDto dto) {
        List<Long> ids = dto.questionIds();
        if (new HashSet<>(ids).size() != ids.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate question ids");
        }
        Map<Long, Question> byId = questionRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Question::getId, Function.identity()));

        List<Question> result = new ArrayList<>(ids.size());
        for (Long id : ids) {
            Question q = byId.get(id);
            // **** Note, ask if this check is needed too q.getExamType() != dto.examType()
            if (q == null || !q.getIsActive() || !q.getCourse().getId().equals(dto.courseId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Question " + id + " is missing, inactive, or not from this course");
            }
            result.add(q);
        }
        return result;
    }
}
