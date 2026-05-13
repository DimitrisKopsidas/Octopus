package com.dkopsidas.octopus.mapper;

import com.dkopsidas.octopus.domain.dto.CourseResponseDto;
import com.dkopsidas.octopus.domain.entity.Course;

public interface CourseMapper {

    CourseResponseDto toDto(Course course);

}
