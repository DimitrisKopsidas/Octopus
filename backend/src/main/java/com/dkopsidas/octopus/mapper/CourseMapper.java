package com.dkopsidas.octopus.mapper;

import com.dkopsidas.octopus.domain.dto.CourseResponseDto;
import com.dkopsidas.octopus.domain.dto.QuestionResponseDto;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.domain.entity.Question;

import java.util.List;

public interface CourseMapper {

    CourseResponseDto toDto(Course course);

    List<CourseResponseDto> toDto(List<Course> courseList);
}
