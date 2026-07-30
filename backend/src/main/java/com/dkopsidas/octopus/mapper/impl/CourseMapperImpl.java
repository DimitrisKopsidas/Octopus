package com.dkopsidas.octopus.mapper.impl;

import com.dkopsidas.octopus.domain.dto.CourseResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateCourseRequestDto;
import com.dkopsidas.octopus.domain.entity.Bundle;
import com.dkopsidas.octopus.domain.entity.Course;
import com.dkopsidas.octopus.mapper.CourseMapper;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class CourseMapperImpl implements CourseMapper {
    @Override
    public Course toEntity(UpdateCourseRequestDto dto) {
        Course course = new Course();
        course.setQuestionSetSize(dto.questionSetSize());
        course.setDefaultTimerMinutes(dto.defaultTimerMinutes());

        return course;
    }

    @Override
    public CourseResponseDto toDto(Course course) {
        return new CourseResponseDto(
            course.getId(),
            course.getName(),
            course.getSemester(),
            course.getQuestionSetSize(),
            course.getDefaultTimerMinutes(),
            course.getUpdatedAt()
        );
    }

    public List<CourseResponseDto> toDto(List<Course> courseList) {
        return courseList.stream()
                .map(this::toDto)
                .toList();
    }
}
