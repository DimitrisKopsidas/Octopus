package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.entity.Course;

import com.dkopsidas.octopus.repository.CourseRepository;
import com.dkopsidas.octopus.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    @Override
    public List<Course> listCourses() {
        return courseRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }
}
