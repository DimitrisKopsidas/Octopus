package com.dkopsidas.octopus.mapper;

import com.dkopsidas.octopus.domain.dto.*;
import com.dkopsidas.octopus.domain.entity.Course;

import java.util.List;

public interface CourseMapper {

    Course toEntity(UpdateCourseRequestDto dto);

    CourseResponseDto toDto(Course course);

    List<CourseResponseDto> toDto(List<Course> courseList);
}
