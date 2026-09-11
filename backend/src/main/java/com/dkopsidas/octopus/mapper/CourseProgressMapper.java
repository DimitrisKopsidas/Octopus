package com.dkopsidas.octopus.mapper;

import com.dkopsidas.octopus.domain.dto.CourseProgressResponseDto;
import com.dkopsidas.octopus.domain.entity.CourseProgress;

import java.util.List;

public interface CourseProgressMapper {

    CourseProgressResponseDto toDto(CourseProgress courseProgress);

    List<CourseProgressResponseDto> toDto(List<CourseProgress> courseProgressList);
}
