package com.dkopsidas.octopus.service;

import com.dkopsidas.octopus.domain.dto.CourseResponseDto;
import com.dkopsidas.octopus.domain.dto.UpdateCourseRequestDto;


import java.util.List;

public interface CourseService {

    List<CourseResponseDto> listCourses();

    List<CourseResponseDto> listCoursesBySemester(int semester);

    List<CourseResponseDto> listCoursesWithQuestions();

    Integer listCoursesCountWithQuestions();

    CourseResponseDto updateCourse(Long courseId, UpdateCourseRequestDto dto);
}
