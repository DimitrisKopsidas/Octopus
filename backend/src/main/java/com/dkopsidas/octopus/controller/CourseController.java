package com.dkopsidas.octopus.controller;


import com.dkopsidas.octopus.domain.dto.CourseResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateCourseRequestDto;
import com.dkopsidas.octopus.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/courses")
public class CourseController {

    private final CourseService courseService;

    @GetMapping(path = "/{semester}")
    public ResponseEntity<List<CourseResponseDto>> listCourses(
            @PathVariable int semester
    ) {
        List<CourseResponseDto> courseResponseDtos = courseService.listCoursesBySemester(semester);
        return ResponseEntity.ok(courseResponseDtos);
    }

    @GetMapping(path = "/with-content")
    public ResponseEntity<List<CourseResponseDto>> listCoursesWithContent() {
        List<CourseResponseDto> courseResponseDtos = courseService.listCoursesWithQuestions();
        return ResponseEntity.ok(courseResponseDtos);
    }

    @GetMapping(path = "/count-with-content")
    public ResponseEntity<Integer> listCoursesCountWithContent() {
        Integer count = courseService.listCoursesCountWithQuestions();
        return ResponseEntity.ok(count);
    }


    //BASIC CRUD---------------------------------------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<CourseResponseDto>> listCourses() {
        List<CourseResponseDto> courseResponseDtos = courseService.listCourses();
        return ResponseEntity.ok(courseResponseDtos);
    }

    @PutMapping(path = "/{courseId}")
    public ResponseEntity<CourseResponseDto> updateQuestion(
            @PathVariable Long courseId,
            @Valid @RequestBody UpdateCourseRequestDto updateCourseRequestDto
    ) {
        CourseResponseDto updatedCourse = courseService.updateCourse(courseId, updateCourseRequestDto);
        return ResponseEntity.ok(updatedCourse);
    }
}
