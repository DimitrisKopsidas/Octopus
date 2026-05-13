package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.CreateMulQuestionRequest;
import com.dkopsidas.octopus.domain.UpdateMulQuestionRequest;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.MulQuestion;
import com.dkopsidas.octopus.exception.MulQuestionNotFoundException;
import com.dkopsidas.octopus.repository.CourseRepository;
import com.dkopsidas.octopus.repository.MulQuestionRepository;
import com.dkopsidas.octopus.service.MulQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@RequiredArgsConstructor
@Service
public class MulQuestionServiceImpl implements MulQuestionService {

    private final MulQuestionRepository mulQuestionRepository;
    private final CourseRepository courseRepository;

    @Override
    public MulQuestion createMulQuestion(CreateMulQuestionRequest request) {
        Course course = courseRepository.findById(request.courseId().orElseThrow(() -> new RuntimeException("Course not found"));

        Instant now = Instant.now();

        MulQuestion question = new MulQuestion();
        question.setTitle(request.title());
        question.setCourse(course);

        for (MulAnswerRequest a : request.answers()) {
            MulAnswer answer = new MulAnswer();
            answer.setTitle(a.title());
            answer.setCorrect(a.isCorrect());

            question.addAnswer(answer); // IMPORTANT: keeps both sides synced
        }

        return mulQuestionRepository.save(mulQuestion);
    }

    @Override
    public List<MulQuestion> listMulQuestions(Course course) {
        return mulQuestionRepository.findByCourse(course);
    }

    @Override
    public MulQuestion updateMulQuestion(Long mulQuestionId, UpdateMulQuestionRequest request) {
        MulQuestion mulQuestion = mulQuestionRepository.findById(mulQuestionId).orElseThrow(() -> new MulQuestionNotFoundException((mulQuestionId)));

        mulQuestion.setTitle(request.title());

        return mulQuestionRepository.save(mulQuestion);
    }

    @Override
    public void deleteMulQuestion(Long mulQuestionId) {
        mulQuestionRepository.deleteById(mulQuestionId);
    }
}
