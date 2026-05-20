package com.dkopsidas.octopus.controller;


import com.dkopsidas.octopus.domain.dto.CourseResponseDto;
import com.dkopsidas.octopus.domain.dto.QuestionResponseDto;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.mapper.CourseMapper;
import com.dkopsidas.octopus.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/courses")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseResponseDto>> listCourses() {
        List<CourseResponseDto> courseResponseDtos = courseService.listCourses();
        return ResponseEntity.ok(courseResponseDtos);
    }

    @GetMapping(path = "/{semester}")
    public ResponseEntity<List<CourseResponseDto>> listQuestions(
            @PathVariable int semester
    ) {
        List<CourseResponseDto> courseResponseDtos = courseService.listCoursesBySemester(semester);
        return ResponseEntity.ok(courseResponseDtos);
    }
}
