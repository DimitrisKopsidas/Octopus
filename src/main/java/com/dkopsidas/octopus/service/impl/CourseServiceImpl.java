package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.entity.Course;

import com.dkopsidas.octopus.repository.CourseRepository;
import com.dkopsidas.octopus.service.CourseService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public List<Course> listCourses() {
        return courseRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }
}
