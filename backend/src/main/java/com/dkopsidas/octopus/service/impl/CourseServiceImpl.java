package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.CourseResponseDto;

import com.dkopsidas.octopus.domain.dto.UpdateCourseRequestDto;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.exception.CourseNotFoundException;
import com.dkopsidas.octopus.mapper.CourseMapper;
import com.dkopsidas.octopus.repository.CourseRepository;
import com.dkopsidas.octopus.service.CourseService;
import lombok.RequiredArgsConstructor;
import com.dkopsidas.octopus.domain.entity.AuditAction;
import com.dkopsidas.octopus.security.audit.AuditEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public List<CourseResponseDto> listCourses() {
        return courseMapper.toDto(courseRepository.findAll());
    }

    @Override
    public List<CourseResponseDto> listCoursesBySemester(int semester) {
        return courseMapper.toDto(courseRepository.findAllBySemester(semester));
    }

    @Override
    public List<CourseResponseDto> listCoursesWithQuestions() {
        return courseMapper.toDto(courseRepository.findDistinctByQuestionsIsActiveTrue());
    }

    @Override
    public Integer listCoursesCountWithQuestions() {
        return courseRepository.countDistinctByQuestionsIsActiveTrue();
    }

    @Override
    public CourseResponseDto updateCourse(Long courseId, UpdateCourseRequestDto updateRequest) {
        Course course = courseRepository.findById(courseId).
                orElseThrow(() -> new CourseNotFoundException(courseId));
        Course courseFromDto = courseMapper.toEntity(updateRequest);

        // Οι παλιές τιμές διαβάζονται πριν το set: το audit log χωρίς το «από τι»
        // λέει μόνο ότι κάτι άλλαξε, όχι τι έγινε.
        int oldSetSize = course.getQuestionSetSize();
        int oldTimer = course.getDefaultTimerMinutes();

        course.setQuestionSetSize(courseFromDto.getQuestionSetSize());
        course.setDefaultTimerMinutes(courseFromDto.getDefaultTimerMinutes());

        Course saved = courseRepository.save(course);

        List<String> changes = new ArrayList<>();
        if (oldSetSize != saved.getQuestionSetSize()) {
            changes.add("questionSetSize " + oldSetSize + " -> " + saved.getQuestionSetSize());
        }
        if (oldTimer != saved.getDefaultTimerMinutes()) {
            changes.add("defaultTimerMinutes " + oldTimer + " -> " + saved.getDefaultTimerMinutes());
        }

        eventPublisher.publishEvent(AuditEvent.success(
                null,
                null,
                AuditAction.COURSE_UPDATED,
                "COURSE",
                saved.getId().toString(),
                "Course \"" + saved.getName() + "\" (#" + saved.getId() + ", "
                        + saved.getSemester() + "o semester): "
                        + (changes.isEmpty() ? "saved with no value changes" : String.join(", ", changes))
        ));

        return courseMapper.toDto(saved);
    }
}
