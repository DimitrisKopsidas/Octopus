package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.CourseProgressResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateCourseProgressRequestDto;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.CourseProgress;
import com.dkopsidas.octopus.domain.entity.User;
import com.dkopsidas.octopus.exception.CourseNotFoundException;
import com.dkopsidas.octopus.exception.UserNotFoundException;
import com.dkopsidas.octopus.mapper.CourseProgressMapper;
import com.dkopsidas.octopus.repository.CourseProgressRepository;
import com.dkopsidas.octopus.repository.CourseRepository;
import com.dkopsidas.octopus.repository.UserRepository;
import com.dkopsidas.octopus.service.CourseProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class CourseProgressServiceImpl implements CourseProgressService {

    private final CourseProgressRepository courseProgressRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseProgressMapper courseProgressMapper;

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
        return courseProgressMapper.toDto(saved);
    }
}
