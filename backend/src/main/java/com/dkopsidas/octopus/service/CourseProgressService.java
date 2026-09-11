package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.CourseProgressResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateCourseProgressRequestDto;

import java.util.List;
import java.util.UUID;

public interface CourseProgressService {

    List<CourseProgressResponseDto> getProgressForUser(UUID userId);

    CourseProgressResponseDto getProgressForUserAndCourse(UUID userId, Long courseId);

    CourseProgressResponseDto updateProgress(UUID userId, Long courseId, UpdateCourseProgressRequestDto dto);

    CourseProgressResponseDto toggleFavorite(UUID userId, Long courseId);

    CourseProgressResponseDto togglePassed(UUID userId, Long courseId);
}
