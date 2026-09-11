package com.dkopsidas.octopus.service;

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
import com.dkopsidas.octopus.service.impl.CourseProgressServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseProgressServiceTest {

    @Mock
    private CourseProgressRepository courseProgressRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private CourseProgressMapper courseProgressMapper;

    @Mock
    private org.springframework.context.ApplicationEventPublisher eventPublisher;

    private CourseProgressServiceImpl courseProgressService;

    private UUID userId;
    private Long courseId;
    private User user;
    private Course course;

    @BeforeEach
    void setUp() {
        courseProgressService = new CourseProgressServiceImpl(
                courseProgressRepository,
                userRepository,
                courseRepository,
                courseProgressMapper,
                eventPublisher
        );
        userId = UUID.randomUUID();
        courseId = 1101L;

        user = new User();
        user.setId(userId);

        course = new Course();
        course.setId(courseId);
    }

    @Test
    void getProgressForUser_ReturnsDtos() {
        CourseProgress progress = new CourseProgress();
        progress.setUser(user);
        progress.setCourse(course);
        progress.setFavorite(true);

        CourseProgressResponseDto dto = new CourseProgressResponseDto(1L, userId, courseId, true, false);

        when(courseProgressRepository.findByUserId(userId)).thenReturn(List.of(progress));
        when(courseProgressMapper.toDto(List.of(progress))).thenReturn(List.of(dto));

        List<CourseProgressResponseDto> result = courseProgressService.getProgressForUser(userId);

        assertEquals(1, result.size());
        assertTrue(result.getFirst().isFavorite());
        verify(courseProgressRepository).findByUserId(userId);
    }

    @Test
    void getProgressForUserAndCourse_Existing_ReturnsDto() {
        CourseProgress progress = new CourseProgress();
        progress.setId(10L);
        progress.setUser(user);
        progress.setCourse(course);
        progress.setPassed(true);

        CourseProgressResponseDto dto = new CourseProgressResponseDto(10L, userId, courseId, false, true);

        when(courseProgressRepository.findByUserIdAndCourseId(userId, courseId)).thenReturn(Optional.of(progress));
        when(courseProgressMapper.toDto(progress)).thenReturn(dto);

        CourseProgressResponseDto result = courseProgressService.getProgressForUserAndCourse(userId, courseId);

        assertNotNull(result);
        assertTrue(result.isPassed());
    }

    @Test
    void getProgressForUserAndCourse_NotFound_ReturnsDefaultDto() {
        when(courseProgressRepository.findByUserIdAndCourseId(userId, courseId)).thenReturn(Optional.empty());

        CourseProgressResponseDto result = courseProgressService.getProgressForUserAndCourse(userId, courseId);

        assertNotNull(result);
        assertNull(result.id());
        assertEquals(userId, result.userId());
        assertEquals(courseId, result.courseId());
        assertFalse(result.isFavorite());
        assertFalse(result.isPassed());
    }

    @Test
    void updateProgress_NewEntity_SavesAndReturnsDto() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));
        when(courseProgressRepository.findByUserIdAndCourseId(userId, courseId)).thenReturn(Optional.empty());

        CourseProgress saved = new CourseProgress();
        saved.setId(1L);
        saved.setUser(user);
        saved.setCourse(course);
        saved.setFavorite(true);
        saved.setPassed(true);

        when(courseProgressRepository.save(any(CourseProgress.class))).thenReturn(saved);
        when(courseProgressMapper.toDto(saved)).thenReturn(
                new CourseProgressResponseDto(1L, userId, courseId, true, true)
        );

        UpdateCourseProgressRequestDto request = new UpdateCourseProgressRequestDto(true, true);
        CourseProgressResponseDto result = courseProgressService.updateProgress(userId, courseId, request);

        assertNotNull(result);
        assertTrue(result.isFavorite());
        assertTrue(result.isPassed());
        verify(courseProgressRepository).save(any(CourseProgress.class));
    }

    @Test
    void toggleFavorite_TogglesState() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));

        CourseProgress progress = new CourseProgress();
        progress.setUser(user);
        progress.setCourse(course);
        progress.setFavorite(false);

        when(courseProgressRepository.findByUserIdAndCourseId(userId, courseId)).thenReturn(Optional.of(progress));
        when(courseProgressRepository.save(progress)).thenReturn(progress);
        when(courseProgressMapper.toDto(progress)).thenAnswer(inv ->
                new CourseProgressResponseDto(1L, userId, courseId, progress.isFavorite(), progress.isPassed())
        );

        CourseProgressResponseDto result = courseProgressService.toggleFavorite(userId, courseId);

        assertTrue(result.isFavorite());
        verify(courseProgressRepository).save(progress);
    }

    @Test
    void togglePassed_TogglesState() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));

        CourseProgress progress = new CourseProgress();
        progress.setUser(user);
        progress.setCourse(course);
        progress.setPassed(true);

        when(courseProgressRepository.findByUserIdAndCourseId(userId, courseId)).thenReturn(Optional.of(progress));
        when(courseProgressRepository.save(progress)).thenReturn(progress);
        when(courseProgressMapper.toDto(progress)).thenAnswer(inv ->
                new CourseProgressResponseDto(1L, userId, courseId, progress.isFavorite(), progress.isPassed())
        );

        CourseProgressResponseDto result = courseProgressService.togglePassed(userId, courseId);

        assertFalse(result.isPassed());
        verify(courseProgressRepository).save(progress);
    }

    @Test
    void updateProgress_UserNotFound_ThrowsException() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () ->
                courseProgressService.updateProgress(userId, courseId, new UpdateCourseProgressRequestDto(true, null))
        );
    }

    @Test
    void updateProgress_CourseNotFound_ThrowsException() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(courseRepository.findById(courseId)).thenReturn(Optional.empty());

        assertThrows(CourseNotFoundException.class, () ->
                courseProgressService.updateProgress(userId, courseId, new UpdateCourseProgressRequestDto(true, null))
        );
    }
}
