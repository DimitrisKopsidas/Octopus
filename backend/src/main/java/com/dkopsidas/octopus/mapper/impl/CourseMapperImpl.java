package com.dkopsidas.octopus.mapper.impl;

import com.dkopsidas.octopus.domain.dto.CourseResponseDto;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.mapper.CourseMapper;
import org.springframework.stereotype.Component;

@Component
public class CourseMapperImpl implements CourseMapper {
    @Override
    public CourseResponseDto toDto(Course course) {
        return new CourseResponseDto(
            course.getId(),
            course.getName(),
            course.getSemester()
        );
    }
}
