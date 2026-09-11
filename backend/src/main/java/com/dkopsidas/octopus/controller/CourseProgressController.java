package com.dkopsidas.octopus.controller;

import com.dkopsidas.octopus.domain.dto.CourseProgressResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateCourseProgressRequestDto;
import com.dkopsidas.octopus.service.CourseProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/course-progress")
public class CourseProgressController {

    private final CourseProgressService courseProgressService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<CourseProgressResponseDto>> getMyProgress(
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        List<CourseProgressResponseDto> progressList = courseProgressService.getProgressForUser(userId);
        return ResponseEntity.ok(progressList);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(path = "/{courseId}")
    public ResponseEntity<CourseProgressResponseDto> getProgressForCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        CourseProgressResponseDto progress = courseProgressService.getProgressForUserAndCourse(userId, courseId);
        return ResponseEntity.ok(progress);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping(path = "/{courseId}")
    public ResponseEntity<CourseProgressResponseDto> updateProgress(
            @PathVariable Long courseId,
            @RequestBody UpdateCourseProgressRequestDto requestDto,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        CourseProgressResponseDto updated = courseProgressService.updateProgress(userId, courseId, requestDto);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping(path = "/{courseId}/favorite")
    public ResponseEntity<CourseProgressResponseDto> toggleFavorite(
            @PathVariable Long courseId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        CourseProgressResponseDto updated = courseProgressService.toggleFavorite(userId, courseId);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping(path = "/{courseId}/passed")
    public ResponseEntity<CourseProgressResponseDto> togglePassed(
            @PathVariable Long courseId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        CourseProgressResponseDto updated = courseProgressService.togglePassed(userId, courseId);
        return ResponseEntity.ok(updated);
    }
}
