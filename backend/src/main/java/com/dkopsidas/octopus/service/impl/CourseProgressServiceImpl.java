package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.CourseProgressResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateCourseProgressRequestDto;
import com.dkopsidas.octopus.domain.entity.AuditAction;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.CourseProgress;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.exception.CourseNotFoundException;
import com.dkopsidas.octopus.exception.UserNotFoundException;
import com.dkopsidas.octopus.mapper.CourseProgressMapper;
import com.dkopsidas.octopus.repository.CourseProgressRepository;
import com.dkopsidas.octopus.repository.CourseRepository;
import com.dkopsidas.octopus.repository.UserRepository;
import com.dkopsidas.octopus.security.audit.AuditEvent;
import com.dkopsidas.octopus.service.CourseProgressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class CourseProgressServiceImpl implements CourseProgressService {

    private final CourseProgressRepository courseProgressRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseProgressMapper courseProgressMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    public List<CourseProgressResponseDto> getProgressForUser(UUID userId) {
        List<CourseProgress> progressList = courseProgressRepository.findByUserId(userId);
        return courseProgressMapper.toDto(progressList);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseProgressResponseDto getProgressForUserAndCourse(UUID userId, Long courseId) {
        return courseProgressRepository.findByUserIdAndCourseId(userId, courseId)
                .map(courseProgressMapper::toDto)
                .orElse(new CourseProgressResponseDto(null, userId, courseId, false, false));
    }

    @Override
    @Transactional
    public CourseProgressResponseDto updateProgress(UUID userId, Long courseId, UpdateCourseProgressRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));

        CourseProgress progress = courseProgressRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseGet(() -> {
                    CourseProgress cp = new CourseProgress();
                    cp.setUser(user);
                    cp.setCourse(course);
                    return cp;
                });

        if (dto.isFavorite() != null) {
            progress.setFavorite(dto.isFavorite());
        }
        if (dto.isPassed() != null) {
            progress.setPassed(dto.isPassed());
        }

        CourseProgress saved = courseProgressRepository.save(progress);

        log.info("User {} ({}) updated progress for course {}: isFavorite={}, isPassed={}",
                userId, user.getUsername(), courseId, saved.isFavorite(), saved.isPassed());
        eventPublisher.publishEvent(AuditEvent.success(
                userId,
                user.getUsername(),
                AuditAction.COURSE_PROGRESS_UPDATED,
                "COURSE",
                String.valueOf(courseId),
                "Ενημέρωση προόδου μαθήματος " + courseId + ": isFavorite=" + saved.isFavorite() + ", isPassed=" + saved.isPassed()
        ));

        return courseProgressMapper.toDto(saved);
    }

    @Override
    @Transactional
    public CourseProgressResponseDto toggleFavorite(UUID userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));

        CourseProgress progress = courseProgressRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseGet(() -> {
                    CourseProgress cp = new CourseProgress();
                    cp.setUser(user);
                    cp.setCourse(course);
                    return cp;
                });

        progress.setFavorite(!progress.isFavorite());

        CourseProgress saved = courseProgressRepository.save(progress);

        log.info("User {} ({}) toggled favorite for course {}: new state isFavorite={}",
                userId, user.getUsername(), courseId, saved.isFavorite());
        eventPublisher.publishEvent(AuditEvent.success(
                userId,
                user.getUsername(),
                AuditAction.COURSE_FAVORITE_TOGGLED,
                "COURSE",
                String.valueOf(courseId),
                (saved.isFavorite() ? "Προστέθηκε στα αγαπημένα" : "Αφαιρέθηκε από τα αγαπημένα") + " (μάθημα " + courseId + ")"
        ));

        return courseProgressMapper.toDto(saved);
    }

    @Override
    @Transactional
    public CourseProgressResponseDto togglePassed(UUID userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));

        CourseProgress progress = courseProgressRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseGet(() -> {
                    CourseProgress cp = new CourseProgress();
                    cp.setUser(user);
                    cp.setCourse(course);
                    return cp;
                });

        progress.setPassed(!progress.isPassed());

        CourseProgress saved = courseProgressRepository.save(progress);

        log.info("User {} ({}) toggled passed for course {}: new state isPassed={}",
                userId, user.getUsername(), courseId, saved.isPassed());
        eventPublisher.publishEvent(AuditEvent.success(
                userId,
                user.getUsername(),
                AuditAction.COURSE_PASSED_TOGGLED,
                "COURSE",
                String.valueOf(courseId),
                (saved.isPassed() ? "Σημειώθηκε ως περασμένο" : "Σημειώθηκε ως μη περασμένο") + " (μάθημα " + courseId + ")"
        ));

        return courseProgressMapper.toDto(saved);
    }
}
