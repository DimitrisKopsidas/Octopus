package com.dkopsidas.octopus.controller;


import com.dkopsidas.octopus.domain.dto.CourseResponseDto;
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
    private final CourseMapper courseMapper;

    @GetMapping
    public ResponseEntity<List<CourseResponseDto>> listCourses() {
        List<Course> courses = courseService.listCourses();
        List<CourseResponseDto> courseResponseDtos = courses.stream().map(courseMapper::toDto).toList();
        return ResponseEntity.ok(courseResponseDtos);
    }
}
