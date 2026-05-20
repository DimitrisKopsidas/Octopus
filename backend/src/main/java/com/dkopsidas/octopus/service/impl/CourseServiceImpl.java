package com.dkopsidas.octopus.service.impl;

import com.dkopsidas.octopus.domain.dto.CourseResponseDto;

import com.dkopsidas.octopus.mapper.CourseMapper;
import com.dkopsidas.octopus.repository.CourseRepository;
import com.dkopsidas.octopus.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;

    @Override
    public List<CourseResponseDto> listCourses() {
        return courseMapper.toDto(courseRepository.findAll());
    }

    @Override
    public List<CourseResponseDto> listCoursesBySemester(int semester) {
        return courseMapper.toDto(courseRepository.findAllBySemester(semester));
    }

    @Override
    public List<CourseResponseDto> listCoursesWithQuestions() {
        return courseMapper.toDto(courseRepository.findAllByQuestionsIsNotEmpty());
    }
}
