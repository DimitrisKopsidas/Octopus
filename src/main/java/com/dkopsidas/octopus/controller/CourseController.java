package com.dkopsidas.octopus.controller;


import com.dkopsidas.octopus.domain.dto.CourseDto;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.mapper.CourseMapper;
import com.dkopsidas.octopus.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/courses")
public class CourseController {

    private final CourseService courseService;
    private final CourseMapper courseMapper;

    public CourseController(CourseService courseService, CourseMapper courseMapper) {
        this.courseService = courseService;
        this.courseMapper = courseMapper;
    }

    @GetMapping
    public ResponseEntity<List<CourseDto>> listCourses() {
        List<Course> courses = courseService.listCourses();
        List<CourseDto> courseDtos = courses.stream().map(courseMapper::toDto).toList();
        return ResponseEntity.ok(courseDtos);
    }
}
